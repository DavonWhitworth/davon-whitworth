"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { getSpecies, searchSpecies, type Species } from "@/content/species";

// Search-as-you-type species picker (an ARIA combobox). Typing shows matching
// species below the box; tap one, or use the arrow keys and Enter.

type Props = {
  inputId: string;
  value: string | null;
  onChange: (speciesId: string | null) => void;
  placeholder?: string;
};

const MAX_RESULTS = 8;

export function SpeciesPicker({
  inputId,
  value,
  onChange,
  placeholder = "Start typing a common or scientific name",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  const results = useMemo(() => searchSpecies(query, MAX_RESULTS), [query]);
  const showList = open && query.trim().length > 0;
  const activeIndex = Math.min(active, results.length - 1);
  const selected = value ? getSpecies(value) : undefined;

  function choose(species: Species) {
    onChange(species.id);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && showList && results[activeIndex]) {
      event.preventDefault();
      choose(results[activeIndex]);
    } else if (event.key === "Escape" && showList) {
      // Close the list without closing the whole dialog.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  }

  if (selected) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2">
        <div>
          <p className="text-fg">{selected.commonName}</p>
          <p className="text-sm text-muted italic">{selected.scientificName}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="shrink-0 rounded-md px-2 py-1 text-sm text-accent hover:bg-border"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={showList && results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results.length > 0 ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-fg placeholder:text-muted"
      />

      {showList ? (
        results.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Matching species"
            className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-border bg-bg"
          >
            {results.map((species, index) => (
              <li
                key={species.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                // Keep focus in the box so the tap registers as a choice.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(species)}
                onMouseEnter={() => setActive(index)}
                className={`cursor-pointer px-3 py-2 ${index === activeIndex ? "bg-surface-2" : ""}`}
              >
                <span className="text-fg">{species.commonName}</span>{" "}
                <span className="text-sm text-muted italic">{species.scientificName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">No species match &ldquo;{query.trim()}&rdquo;.</p>
        )
      ) : null}
    </div>
  );
}
