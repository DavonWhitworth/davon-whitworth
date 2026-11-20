// CSUS-Trees: the shapes and rules shared by the browser and the server.
//
// The database stores snake_case rows (see ./server/rows.ts). Everything that
// crosses the API is camelCase and defined here, so the add page and the route
// handlers agree on one contract. Keep the limits in sync with
// supabase/migrations/0002_trees.sql, which enforces them again in the database.

import { z } from "zod";
import { isSpeciesId } from "@/content/species";

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

export const TREE_NUMBER_MIN = 1;
export const TREE_NUMBER_MAX = 9999;

/** Worst GPS accuracy (metres) a reading may have. */
export const MAX_ACCURACY_M = 15;

/**
 * When a reading is this far from where the tree is already mapped, ask
 * "Is #N really the tree you meant?" before saving. Honest readings of the
 * same tree (each within 15 m) almost never land this far apart, so this
 * usually means a mistyped number. A confirmed far reading is still saved:
 * blocking it would make a wrongly mapped first entry impossible to correct,
 * and the database keeps such a reading from moving the tree until other
 * readings agree with it.
 */
export const FAR_FROM_TREE_M = 40;

/**
 * Coarse box around campus. Placeholder until the campus polygon is approved;
 * the database has the same box as a backstop.
 */
export const CAMPUS_BOUNDS = {
  minLat: 38.545,
  maxLat: 38.575,
  minLng: -121.44,
  maxLng: -121.41,
} as const;

// ---------------------------------------------------------------------------
// Objects returned by the API
// ---------------------------------------------------------------------------

/** A production tree: calculated from everyone's readings. What the map shows. */
export type ProductionTree = {
  treeNumber: number;
  lat: number;
  lng: number;
  /** Most-reported species, or null if nobody named one. Look up names with getSpecies(). */
  speciesId: string | null;
  /** How many readings named the winning species. */
  speciesVotes: number;
  /** How many readings the tree is calculated from. */
  readingCount: number;
  /** ISO 8601 timestamp of the last recalculation. */
  updatedAt: string;
};

/** One of the signed-in user's own readings. Other users' readings are never sent. */
export type MyReading = {
  treeNumber: number;
  lat: number;
  lng: number;
  accuracyM: number;
  speciesId: string | null;
  /** ISO 8601 timestamps. */
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

/** Body of PUT /api/csus-trees/readings/{treeNumber}. Shape only; rules are in checkReading(). */
export const readingInputSchema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite(),
  accuracyM: z.number().finite(),
  speciesId: z.string().nullable(),
  /** Set true after the user answers yes to "Is #N really the tree you meant?" */
  confirmFar: z.boolean().optional().default(false),
});

export type ReadingInput = z.input<typeof readingInputSchema>;
export type ParsedReadingInput = z.output<typeof readingInputSchema>;

/** Body of PATCH /api/csus-trees/readings/{treeNumber}: change only the species, keep the location. */
export const speciesUpdateSchema = z.object({
  speciesId: z.string().nullable(),
});

export type SpeciesUpdateInput = z.infer<typeof speciesUpdateSchema>;

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

/** GET /api/csus-trees/trees */
export type ListTreesResponse = { trees: ProductionTree[] };

/** GET /api/csus-trees/readings (the caller's own readings) */
export type ListMyReadingsResponse = { readings: MyReading[] };

/** PUT /api/csus-trees/readings/{treeNumber} */
export type SaveReadingResponse = {
  /** True when this added a new reading, false when it updated the user's existing one. */
  created: boolean;
  reading: MyReading;
  /** The production tree after recalculation. */
  tree: ProductionTree;
};

/** PATCH /api/csus-trees/readings/{treeNumber} */
export type UpdateSpeciesResponse = {
  reading: MyReading;
  /** The production tree after recalculation. */
  tree: ProductionTree;
};

/** DELETE /api/csus-trees/readings/{treeNumber} */
export type DeleteReadingResponse = {
  /** The production tree after recalculation, or null if that was its last reading. */
  tree: ProductionTree | null;
};

export type TreeErrorCode =
  | "invalid_request" // body or path is malformed
  | "invalid_tree_number" // not a whole number 1-9999
  | "unknown_species" // speciesId is not in species.ts
  | "accuracy_too_low" // accuracyM is worse than MAX_ACCURACY_M
  | "off_campus" // outside the campus boundary
  | "far_from_tree" // 409: ask "Is #N really the tree you meant?", resend with confirmFar: true (includes distanceM)
  | "not_signed_in" // 401
  | "blocked" // 403
  | "not_found" // 404: the user has no reading for that number
  | "rate_limited" // 429
  | "server_error"; // 500

/** Every error response: a human-readable message plus a code the page can act on. */
export type TreeErrorResponse = {
  error: string;
  code: TreeErrorCode;
  /** Only with far_from_tree: metres from the tree's current spot. */
  distanceM?: number;
};

// ---------------------------------------------------------------------------
// Rules (run in the browser for instant feedback and again on the server)
// ---------------------------------------------------------------------------

/**
 * Turn what the user typed (or a URL segment) into a tree number.
 * Leading zeros are ignored: "0042" -> 42. Returns null if invalid.
 */
export function parseTreeNumber(input: string | number): number | null {
  const text = String(input).trim();
  if (!/^\d{1,8}$/.test(text)) return null;
  const value = Number(text);
  return value >= TREE_NUMBER_MIN && value <= TREE_NUMBER_MAX ? value : null;
}

export function isOnCampus(lat: number, lng: number): boolean {
  const b = CAMPUS_BOUNDS;
  return lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng;
}

/** Flat-earth distance in metres; accurate to well under 1% at campus scale. */
export function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const metresPerDegree = 111_320;
  const dy = (a.lat - b.lat) * metresPerDegree;
  const dx = (a.lng - b.lng) * metresPerDegree * Math.cos((a.lat * Math.PI) / 180);
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check a reading against every rule that doesn't need the database.
 * Returns the first problem found, or null if the reading is acceptable.
 * The far-from-tree check needs the tree's current spot, so the server does it.
 */
export function checkReading(
  input: Pick<ParsedReadingInput, "lat" | "lng" | "accuracyM" | "speciesId">,
): TreeErrorCode | null {
  if (!(input.accuracyM > 0)) return "invalid_request";
  if (input.accuracyM > MAX_ACCURACY_M) return "accuracy_too_low";
  if (!isOnCampus(input.lat, input.lng)) return "off_campus";
  if (input.speciesId !== null && !isSpeciesId(input.speciesId)) return "unknown_species";
  return null;
}
