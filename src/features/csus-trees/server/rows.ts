import "server-only";

import type { MyReading, ProductionTree } from "@/features/csus-trees/model";

// Database rows exactly as Supabase returns them (snake_case), matching
// supabase/migrations/0002_trees.sql. Only server code sees these; the API
// sends the camelCase shapes from ../model instead.

/** public.tree_readings: private, written only through the server. */
export type TreeReadingRow = {
  tree_number: number;
  user_id: string;
  lat: number;
  lng: number;
  accuracy_m: number;
  species_id: string | null;
  /** When this user last changed the species; ties go to the older one. */
  species_set_at: string;
  created_at: string;
  updated_at: string;
};

/** What the server sends when adding or updating a reading. Timestamps are set by the database. */
export type TreeReadingWrite = Pick<
  TreeReadingRow,
  "tree_number" | "user_id" | "lat" | "lng" | "accuracy_m" | "species_id"
>;

/** public.production_trees: public, written only by recalc_tree() in the database. */
export type ProductionTreeRow = {
  tree_number: number;
  lat: number;
  lng: number;
  species_id: string | null;
  species_votes: number;
  reading_count: number;
  updated_at: string;
};

export const TREE_READING_COLUMNS =
  "tree_number, user_id, lat, lng, accuracy_m, species_id, species_set_at, created_at, updated_at";

export const PRODUCTION_TREE_COLUMNS =
  "tree_number, lat, lng, species_id, species_votes, reading_count, updated_at";

export function toProductionTree(row: ProductionTreeRow): ProductionTree {
  return {
    treeNumber: row.tree_number,
    lat: row.lat,
    lng: row.lng,
    speciesId: row.species_id,
    speciesVotes: row.species_votes,
    readingCount: row.reading_count,
    updatedAt: row.updated_at,
  };
}

/** Drops user_id and species_set_at: neither is sent to the browser. */
export function toMyReading(row: TreeReadingRow): MyReading {
  return {
    treeNumber: row.tree_number,
    lat: row.lat,
    lng: row.lng,
    accuracyM: row.accuracy_m,
    speciesId: row.species_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
