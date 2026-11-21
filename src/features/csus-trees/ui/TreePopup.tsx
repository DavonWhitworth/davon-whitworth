"use client";

import { useState } from "react";
import { getSpecies } from "@/content/species";
import type { MyReading, ProductionTree } from "@/features/csus-trees/model";
import { DeleteEntryConfirm } from "@/features/csus-trees/ui/DeleteEntryConfirm";

// What shows in the map popup when a tree is tapped: its number, species and
// entry count. If the signed-in user has an entry for it (for example they
// just added it with the wrong number), they can delete it right here.

type Props = {
  tree: ProductionTree;
  /** The signed-in user's entry for this tree, if any. */
  myEntry: MyReading | null;
  onDeleted: (tree: ProductionTree | null | undefined) => void;
};

export function TreePopup({ tree, myEntry, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false);
  const species = tree.speciesId ? getSpecies(tree.speciesId) : undefined;

  return (
    <div className="text-sm text-neutral-900">
      <p className="font-semibold">Tree #{tree.treeNumber}</p>
      <p>{species ? species.commonName : "Species not recorded yet"}</p>
      {species ? <p className="text-neutral-600 italic">{species.scientificName}</p> : null}
      <p className="mt-1 text-xs text-neutral-600">
        Based on {tree.readingCount} {tree.readingCount === 1 ? "entry" : "entries"}
      </p>

      {myEntry ? (
        <div className="mt-2 border-t border-neutral-200 pt-2">
          {confirming ? (
            <DeleteEntryConfirm
              tone="light"
              treeNumber={tree.treeNumber}
              isOnlyEntry={tree.readingCount === 1}
              onDeleted={onDeleted}
              onCancel={() => setConfirming(false)}
            />
          ) : (
            <>
              <p className="text-xs text-neutral-600">You have an entry for this tree.</p>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="mt-2 rounded-full border border-red-700 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                Delete my entry
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
