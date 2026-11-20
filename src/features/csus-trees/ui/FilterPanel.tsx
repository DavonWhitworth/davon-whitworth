"use client";

import { useId } from "react";
import { getSpecies } from "@/content/species";
import { parseTreeNumber, type ProductionTree } from "@/features/csus-trees/model";
import { Panel } from "@/features/csus-trees/ui/Panel";
import { SpeciesPicker } from "@/features/csus-trees/ui/SpeciesPicker";

// Filter the map by tree number and/or species. Filtering happens in the
// browser on the trees already loaded, so it is instant.

export type TreeFilter = {
  /** What the user typed; parsed with parseTreeNumber. Empty = any number. */
  numberText: string;
  /** Empty (null) = any species. */
  speciesId: string | null;
};

export const NO_FILTER: TreeFilter = { numberText: "", speciesId: null };

export function isFilterActive(filter: TreeFilter): boolean {
  return filter.numberText !== "" || filter.speciesId !== null;
}

export function filterTrees(trees: ProductionTree[], filter: TreeFilter): ProductionTree[] {
  if (!isFilterActive(filter)) return trees;
  const number = filter.numberText === "" ? null : parseTreeNumber(filter.numberText);
  // Something typed that isn't a valid tree number matches nothing.
  if (filter.numberText !== "" && number === null) return [];
  return trees.filter(
    (tree) =>
      (number === null || tree.treeNumber === number) &&
      (filter.speciesId === null || tree.speciesId === filter.speciesId),
  );
}

/** Short description of an active filter, e.g. "#42, Valley Oak". */
export function describeFilter(filter: TreeFilter): string {
  const parts: string[] = [];
  if (filter.numberText !== "") parts.push(`#${parseTreeNumber(filter.numberText) ?? filter.numberText}`);
  if (filter.speciesId) parts.push(getSpecies(filter.speciesId)?.commonName ?? filter.speciesId);
  return parts.join(", ");
}

type Props = {
  filter: TreeFilter;
  onChange: (filter: TreeFilter) => void;
  totalCount: number;
  visibleCount: number;
  onClose: () => void;
};

export function FilterPanel({ filter, onChange, totalCount, visibleCount, onClose }: Props) {
  const numberId = useId();
  const speciesId = useId();
  const active = isFilterActive(filter);

  return (
    <Panel title="Filter trees" onClose={onClose}>
      <label htmlFor={numberId} className="block font-medium text-fg">
        Tree number
      </label>
      <input
        id={numberId}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={8}
        autoComplete="off"
        placeholder="Any number"
        value={filter.numberText}
        onChange={(event) => onChange({ ...filter, numberText: event.target.value.replace(/\D/g, "") })}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-fg placeholder:text-muted"
      />

      <label htmlFor={speciesId} className="mt-5 block font-medium text-fg">
        Species
      </label>
      <div className="mt-2">
        <SpeciesPicker
          inputId={speciesId}
          value={filter.speciesId}
          onChange={(value) => onChange({ ...filter, speciesId: value })}
          placeholder="Any species"
        />
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {active
          ? visibleCount === 0
            ? "No trees on the map match."
            : `Showing ${visibleCount} of ${totalCount} ${totalCount === 1 ? "tree" : "trees"}.`
          : `${totalCount} ${totalCount === 1 ? "tree" : "trees"} on the map.`}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-contrast transition-colors hover:bg-accent-strong"
        >
          Done
        </button>
        {active ? (
          <button
            type="button"
            onClick={() => onChange(NO_FILTER)}
            className="rounded-full border border-border px-5 py-2.5 font-medium text-fg transition-colors hover:bg-surface-2"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </Panel>
  );
}
