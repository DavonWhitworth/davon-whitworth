import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PRODUCTION_TREE_COLUMNS,
  TREE_READING_COLUMNS,
  type ProductionTreeRow,
  type TreeReadingRow,
  type TreeReadingWrite,
} from "@/features/csus-trees/server/rows";

// Database queries for CSUS-Trees. Every function takes the admin client and
// trusts its caller to have checked who is asking. Production trees are never
// written here: the database recalculates them on every reading change.

/** Supabase returns at most 1000 rows per request, so page through. */
const PAGE_SIZE = 1000;

export async function listProductionTrees(db: SupabaseClient): Promise<ProductionTreeRow[]> {
  const rows: ProductionTreeRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await db
      .from("production_trees")
      .select(PRODUCTION_TREE_COLUMNS)
      .order("tree_number")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data as ProductionTreeRow[]));
    if (data.length < PAGE_SIZE) return rows;
  }
}

export async function getProductionTree(
  db: SupabaseClient,
  treeNumber: number,
): Promise<ProductionTreeRow | null> {
  const { data, error } = await db
    .from("production_trees")
    .select(PRODUCTION_TREE_COLUMNS)
    .eq("tree_number", treeNumber)
    .maybeSingle();
  if (error) throw error;
  return data as ProductionTreeRow | null;
}

export async function listMyReadings(db: SupabaseClient, userId: string): Promise<TreeReadingRow[]> {
  const rows: TreeReadingRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await db
      .from("tree_readings")
      .select(TREE_READING_COLUMNS)
      .eq("user_id", userId)
      .order("tree_number")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data as TreeReadingRow[]));
    if (data.length < PAGE_SIZE) return rows;
  }
}

export async function hasReading(db: SupabaseClient, treeNumber: number, userId: string): Promise<boolean> {
  const { data, error } = await db
    .from("tree_readings")
    .select("tree_number")
    .eq("tree_number", treeNumber)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

/** Add the reading, or replace the user's existing reading for that number. */
export async function upsertReading(db: SupabaseClient, reading: TreeReadingWrite): Promise<TreeReadingRow> {
  const { data, error } = await db
    .from("tree_readings")
    .upsert(reading, { onConflict: "tree_number,user_id" })
    .select(TREE_READING_COLUMNS)
    .single();
  if (error) throw error;
  return data as TreeReadingRow;
}

/** Returns false if the user had no reading for that number. */
export async function deleteReading(db: SupabaseClient, treeNumber: number, userId: string): Promise<boolean> {
  const { data, error } = await db
    .from("tree_readings")
    .delete()
    .eq("tree_number", treeNumber)
    .eq("user_id", userId)
    .select("tree_number");
  if (error) throw error;
  return data.length > 0;
}
