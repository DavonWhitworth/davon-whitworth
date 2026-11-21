"use client";

import { useState } from "react";
import type { ProductionTree } from "@/features/csus-trees/model";
import { deleteReading } from "@/features/csus-trees/ui/api";

// "Delete your entry for tree #N?" confirmation, shared by the My entries list
// and the map popup so both behave the same.

type Props = {
  treeNumber: number;
  /** True when this is the tree's only entry: deleting removes the tree from the map. */
  isOnlyEntry: boolean;
  /**
   * Called after the entry is gone. `tree` is the recalculated production tree,
   * null if that was its last entry, or undefined if the entry was already gone
   * (nothing to recalculate).
   */
  onDeleted: (tree: ProductionTree | null | undefined) => void;
  onCancel: () => void;
  /** "dark" inside the app's panels, "light" inside the white map popup. */
  tone?: "dark" | "light";
};

export function DeleteEntryConfirm({ treeNumber, isOnlyEntry, onDeleted, onCancel, tone = "dark" }: Props) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setWorking(true);
    setError(null);
    const result = await deleteReading(treeNumber);
    setWorking(false);
    if (result.ok) onDeleted(result.data.tree);
    else if (result.status === 404) onDeleted(undefined);
    else setError(result.error.error);
  }

  const light = tone === "light";
  const text = light ? "text-neutral-900" : "text-fg";
  const errorText = light ? "text-red-700" : "text-status-archived";
  const deleteButton = light
    ? "border-red-700 text-red-700 hover:bg-red-50"
    : "border-status-archived text-status-archived hover:bg-surface-2";
  const cancelButton = light
    ? "border-neutral-300 text-neutral-900 hover:bg-neutral-100"
    : "border-border text-fg hover:bg-surface-2";

  return (
    <div>
      <p className={`text-sm ${text}`}>
        Delete your entry for tree #{treeNumber}? This can&apos;t be undone.
        {isOnlyEntry ? " It's the only entry, so the tree will disappear from the map." : ""}
      </p>
      {error ? (
        <p className={`mt-2 text-sm ${errorText}`} role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={working}
          onClick={() => void remove()}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${deleteButton}`}
        >
          {working ? "Deleting…" : "Delete"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${cancelButton}`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
