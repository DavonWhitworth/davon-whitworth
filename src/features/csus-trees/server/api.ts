import "server-only";

import { NextResponse } from "next/server";
import { getCaller, type Caller } from "@/server/caller";
import { rateLimit } from "@/server/rate-limit";
import { getSupabaseAdmin } from "@/server/supabase-admin";
import {
  FAR_FROM_TREE_M,
  checkReading,
  distanceM,
  parseTreeNumber,
  readingInputSchema,
  speciesUpdateSchema,
  type DeleteReadingResponse,
  type ListMyReadingsResponse,
  type ListTreesResponse,
  type SaveReadingResponse,
  type TreeErrorCode,
  type TreeErrorResponse,
  type UpdateSpeciesResponse,
} from "@/features/csus-trees/model";
import { isSpeciesId } from "@/content/species";
import {
  deleteReading,
  getProductionTree,
  hasReading,
  listMyReadings,
  listProductionTrees,
  updateReadingSpecies,
  upsertReading,
} from "@/features/csus-trees/server/db";
import { toMyReading, toProductionTree } from "@/features/csus-trees/server/rows";

// Request handling for the CSUS-Trees API. The route files in
// src/app/api/csus-trees only call these. See ../README.md for the contract.

/** Saves and deletes per user per hour. Generous enough for mapping a walk. */
const WRITES_PER_HOUR = 120;
const ONE_HOUR_MS = 60 * 60 * 1000;

// Tree data changes with every entry, so nothing here is cached.
const NO_STORE = { "Cache-Control": "no-store" };

const MESSAGES: Record<TreeErrorCode, string> = {
  invalid_request: "Something was wrong with that request. Please try again.",
  invalid_tree_number: "Tree numbers are whole numbers from 1 to 9999.",
  unknown_species: "That species isn't in the list.",
  accuracy_too_low: "Your location isn't accurate enough yet. Wait for a better GPS signal and try again.",
  off_campus: "That location is outside the Sacramento State campus.",
  far_from_tree: "You're far from where this tree is mapped.",
  not_signed_in: "Please sign in first.",
  blocked: "Your account can't add or change trees.",
  not_found: "You don't have an entry for that tree.",
  rate_limited: "Too many changes in a short time. Please try again later.",
  server_error: "Something went wrong on our side. Please try again.",
};

function ok<T>(body: T): NextResponse<T> {
  return NextResponse.json(body, { headers: NO_STORE });
}

function fail(code: TreeErrorCode, status: number, extra?: { error?: string; distanceM?: number }) {
  const body: TreeErrorResponse = { error: extra?.error ?? MESSAGES[code], code };
  if (extra?.distanceM !== undefined) body.distanceM = extra.distanceM;
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function notConfigured() {
  return fail("server_error", 503, { error: "Tree data isn't available right now." });
}

function serverError(where: string, error: unknown) {
  console.error(`[csus-trees] ${where} failed:`, error);
  return fail("server_error", 500);
}

type WriteAccess = { caller: Caller } | { response: NextResponse };

/** Signed in, not blocked, and under the write limit. */
async function requireWriter(db: NonNullable<ReturnType<typeof getSupabaseAdmin>>): Promise<WriteAccess> {
  const caller = await getCaller(db);
  if (!caller) return { response: fail("not_signed_in", 401) };
  if (caller.isBlocked) return { response: fail("blocked", 403) };
  if (!rateLimit(`csus-trees:write:${caller.userId}`, WRITES_PER_HOUR, ONE_HOUR_MS)) {
    return { response: fail("rate_limited", 429) };
  }
  return { caller };
}

/** GET /api/csus-trees/trees: every production tree. Public. */
export async function handleListTrees() {
  const db = getSupabaseAdmin();
  if (!db) return notConfigured();
  try {
    const rows = await listProductionTrees(db);
    return ok<ListTreesResponse>({ trees: rows.map(toProductionTree) });
  } catch (error) {
    return serverError("list trees", error);
  }
}

/** GET /api/csus-trees/readings: the caller's own entries. */
export async function handleListMyReadings() {
  const db = getSupabaseAdmin();
  if (!db) return notConfigured();
  try {
    const caller = await getCaller(db);
    if (!caller) return fail("not_signed_in", 401);
    const rows = await listMyReadings(db, caller.userId);
    return ok<ListMyReadingsResponse>({ readings: rows.map(toMyReading) });
  } catch (error) {
    return serverError("list my readings", error);
  }
}

/** PUT /api/csus-trees/readings/{treeNumber}: add or replace the caller's entry. */
export async function handleSaveReading(request: Request, rawTreeNumber: string) {
  const db = getSupabaseAdmin();
  if (!db) return notConfigured();
  try {
    const access = await requireWriter(db);
    if ("response" in access) return access.response;
    const { userId } = access.caller;

    const treeNumber = parseTreeNumber(rawTreeNumber);
    if (treeNumber === null) return fail("invalid_tree_number", 400);

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return fail("invalid_request", 400);
    }
    const parsed = readingInputSchema.safeParse(json);
    if (!parsed.success) return fail("invalid_request", 400);
    const input = parsed.data;

    const problem = checkReading(input);
    if (problem) return fail(problem, 400);

    // Mistyped-number check: "Is #N really the tree you meant?"
    const current = await getProductionTree(db, treeNumber);
    if (current && !input.confirmFar) {
      const distance = distanceM(input, current);
      if (distance > FAR_FROM_TREE_M) {
        const metres = Math.round(distance);
        return fail("far_from_tree", 409, {
          error: `You're about ${metres} m from where tree #${treeNumber} is mapped. Is #${treeNumber} really the tree you meant?`,
          distanceM: metres,
        });
      }
    }

    const existed = await hasReading(db, treeNumber, userId);
    const row = await upsertReading(db, {
      tree_number: treeNumber,
      user_id: userId,
      lat: input.lat,
      lng: input.lng,
      accuracy_m: input.accuracyM,
      species_id: input.speciesId,
    });

    // The database recalculated the production tree as part of the save.
    const tree = await getProductionTree(db, treeNumber);
    if (!tree) throw new Error(`production tree ${treeNumber} missing after save`);

    return ok<SaveReadingResponse>({
      created: !existed,
      reading: toMyReading(row),
      tree: toProductionTree(tree),
    });
  } catch (error) {
    return serverError("save reading", error);
  }
}

/** PATCH /api/csus-trees/readings/{treeNumber}: change only the species of the caller's entry. */
export async function handleUpdateSpecies(request: Request, rawTreeNumber: string) {
  const db = getSupabaseAdmin();
  if (!db) return notConfigured();
  try {
    const access = await requireWriter(db);
    if ("response" in access) return access.response;

    const treeNumber = parseTreeNumber(rawTreeNumber);
    if (treeNumber === null) return fail("invalid_tree_number", 400);

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return fail("invalid_request", 400);
    }
    const parsed = speciesUpdateSchema.safeParse(json);
    if (!parsed.success) return fail("invalid_request", 400);
    const { speciesId } = parsed.data;
    if (speciesId !== null && !isSpeciesId(speciesId)) return fail("unknown_species", 400);

    const row = await updateReadingSpecies(db, treeNumber, access.caller.userId, speciesId);
    if (!row) return fail("not_found", 404);

    // The database recalculated the production tree as part of the update.
    const tree = await getProductionTree(db, treeNumber);
    if (!tree) throw new Error(`production tree ${treeNumber} missing after update`);
    return ok<UpdateSpeciesResponse>({ reading: toMyReading(row), tree: toProductionTree(tree) });
  } catch (error) {
    return serverError("update species", error);
  }
}

/** DELETE /api/csus-trees/readings/{treeNumber}: remove the caller's entry. */
export async function handleDeleteReading(rawTreeNumber: string) {
  const db = getSupabaseAdmin();
  if (!db) return notConfigured();
  try {
    const access = await requireWriter(db);
    if ("response" in access) return access.response;

    const treeNumber = parseTreeNumber(rawTreeNumber);
    if (treeNumber === null) return fail("invalid_tree_number", 400);

    const deleted = await deleteReading(db, treeNumber, access.caller.userId);
    if (!deleted) return fail("not_found", 404);

    // Null when that was the tree's last entry (the database removed it).
    const tree = await getProductionTree(db, treeNumber);
    return ok<DeleteReadingResponse>({ tree: tree ? toProductionTree(tree) : null });
  } catch (error) {
    return serverError("delete reading", error);
  }
}
