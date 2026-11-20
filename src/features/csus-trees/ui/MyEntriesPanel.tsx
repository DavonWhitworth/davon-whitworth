"use client";

import { useEffect, useId, useState, type Dispatch, type SetStateAction } from "react";
import { getSpecies } from "@/content/species";
import { signInWithGoogle } from "@/components/auth/supabase-browser";
import {
  MAX_ACCURACY_M,
  isOnCampus,
  type MyReading,
  type ProductionTree,
  type ReadingInput,
} from "@/features/csus-trees/model";
import { deleteReading, fetchMyReadings, saveReading, updateSpecies } from "@/features/csus-trees/ui/api";
import { useIsTouchDevice, type LocationStatus, type UserPosition } from "@/features/csus-trees/ui/hooks";
import { LocationLine } from "@/features/csus-trees/ui/LocationLine";
import { Panel } from "@/features/csus-trees/ui/Panel";
import { SpeciesPicker } from "@/features/csus-trees/ui/SpeciesPicker";

// "My entries": the signed-in user's own entries, listed over the map. Each
// one can be shown on the map, re-labelled (species), moved to where the user
// is standing, or deleted. The tree number can't change: delete and re-add.

type Location = { status: LocationStatus; position: UserPosition | null; start: () => void };

type Props = {
  signedIn: boolean | undefined;
  /** Last list fetched, shown straight away while a fresh copy loads. */
  entries: MyReading[] | null;
  onEntriesChange: Dispatch<SetStateAction<MyReading[] | null>>;
  trees: ProductionTree[];
  location: Location;
  /** A production tree changed (or disappeared, when its last entry was deleted). */
  onTreeChanged: (treeNumber: number, tree: ProductionTree | null) => void;
  onShowOnMap: (lat: number, lng: number) => void;
  onClose: () => void;
};

/** A reading older than this is too stale to use as "where I'm standing". */
const MAX_POSITION_AGE_MS = 30_000;
const SKIP_TOUCH_CHECK = process.env.NODE_ENV === "development";

const smallButton =
  "rounded-full border border-border px-3 py-1.5 text-sm text-fg transition-colors hover:bg-surface-2 disabled:opacity-50";
const primaryButton =
  "rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50";

function speciesName(id: string | null): string {
  if (!id) return "No species";
  return getSpecies(id)?.commonName ?? id;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function MyEntriesPanel({
  signedIn,
  entries,
  onEntriesChange,
  trees,
  location,
  onTreeChanged,
  onShowOnMap,
  onClose,
}: Props) {
  // The panel mounts fresh on every open, so it starts out refreshing.
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Refresh the list every time the panel opens.
  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    fetchMyReadings().then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (result.ok) {
        setLoadError(null);
        onEntriesChange(result.data.readings);
      } else {
        setLoadError(result.error.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [signedIn, onEntriesChange]);

  function replaceEntry(reading: MyReading) {
    onEntriesChange((current) =>
      (current ?? []).map((entry) => (entry.treeNumber === reading.treeNumber ? reading : entry)),
    );
  }

  function removeEntry(treeNumber: number) {
    onEntriesChange((current) => (current ?? []).filter((entry) => entry.treeNumber !== treeNumber));
  }

  function body() {
    if (signedIn === undefined) return <p className="text-muted">Checking your sign-in&hellip;</p>;
    if (!signedIn) {
      return (
        <div>
          <p className="text-muted">Sign in to see and manage the trees you&apos;ve added.</p>
          <button type="button" onClick={() => void signInWithGoogle()} className={`${primaryButton} mt-4 px-5 py-2.5 text-base`}>
            Sign in with Google
          </button>
        </div>
      );
    }
    if (loadError && !entries) return <p className="text-status-archived">{loadError}</p>;
    if (!entries) return <p className="text-muted">Loading your entries&hellip;</p>;
    if (entries.length === 0) {
      return <p className="text-muted">You haven&apos;t added any trees yet. Tap &ldquo;Add a tree&rdquo; while standing next to one.</p>;
    }

    const byNumber = new Map(trees.map((tree) => [tree.treeNumber, tree]));
    const sorted = [...entries].sort((a, b) => a.treeNumber - b.treeNumber);
    return (
      <>
        <p className="mb-3 text-sm text-muted">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
          {loading ? " (refreshing…)" : ""}
        </p>
        {loadError ? <p className="mb-3 text-sm text-status-archived">{loadError}</p> : null}
        <ul className="space-y-3">
          {sorted.map((entry) => (
            <EntryItem
              key={entry.treeNumber}
              entry={entry}
              tree={byNumber.get(entry.treeNumber) ?? null}
              location={location}
              onUpdated={(reading, tree) => {
                replaceEntry(reading);
                onTreeChanged(tree.treeNumber, tree);
              }}
              onDeleted={(tree) => {
                removeEntry(entry.treeNumber);
                onTreeChanged(entry.treeNumber, tree);
              }}
              onShowOnMap={onShowOnMap}
            />
          ))}
        </ul>
      </>
    );
  }

  return (
    <Panel title="My entries" onClose={onClose}>
      {body()}
    </Panel>
  );
}

type Mode =
  | { kind: "view" }
  | { kind: "edit" }
  | { kind: "confirmFar"; message: string; input: ReadingInput }
  | { kind: "confirmDelete" };

function EntryItem({
  entry,
  tree,
  location,
  onUpdated,
  onDeleted,
  onShowOnMap,
}: {
  entry: MyReading;
  tree: ProductionTree | null;
  location: Location;
  onUpdated: (reading: MyReading, tree: ProductionTree) => void;
  onDeleted: (tree: ProductionTree | null) => void;
  onShowOnMap: (lat: number, lng: number) => void;
}) {
  const isTouch = useIsTouchDevice();
  const speciesInputId = useId();
  const moveId = useId();
  const [mode, setMode] = useState<Mode>({ kind: "view" });
  const [species, setSpecies] = useState<string | null>(entry.speciesId);
  const [moveHere, setMoveHere] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canMove = isTouch || SKIP_TOUCH_CHECK;
  const { status, position } = location;
  const accurate = position !== null && position.accuracyM <= MAX_ACCURACY_M;
  const onCampus = position !== null && isOnCampus(position.lat, position.lng);

  function startEdit() {
    setSpecies(entry.speciesId);
    setMoveHere(false);
    setError(null);
    setMode({ kind: "edit" });
  }

  async function saveWithLocation(input: ReadingInput) {
    setWorking(true);
    setError(null);
    const result = await saveReading(entry.treeNumber, input);
    setWorking(false);
    if (result.ok) {
      onUpdated(result.data.reading, result.data.tree);
      setMode({ kind: "view" });
    } else if (result.error.code === "far_from_tree") {
      setMode({ kind: "confirmFar", message: result.error.error, input });
    } else {
      setMode({ kind: "edit" });
      setError(result.error.error);
    }
  }

  async function save() {
    if (moveHere) {
      if (!position || !accurate || !onCampus) {
        setError(`Your location needs to be on campus and accurate to ${MAX_ACCURACY_M} m or better.`);
        return;
      }
      if (Date.now() - position.timestamp > MAX_POSITION_AGE_MS) {
        setError("Your location is out of date. Wait a moment for a fresh GPS reading.");
        return;
      }
      await saveWithLocation({ lat: position.lat, lng: position.lng, accuracyM: position.accuracyM, speciesId: species });
      return;
    }

    if (species === entry.speciesId) {
      setMode({ kind: "view" });
      return;
    }
    setWorking(true);
    setError(null);
    const result = await updateSpecies(entry.treeNumber, { speciesId: species });
    setWorking(false);
    if (result.ok) {
      onUpdated(result.data.reading, result.data.tree);
      setMode({ kind: "view" });
    } else {
      setError(result.error.error);
    }
  }

  async function remove() {
    setWorking(true);
    setError(null);
    const result = await deleteReading(entry.treeNumber);
    setWorking(false);
    // 404 means it was already gone: treat it as deleted.
    if (result.ok || result.status === 404) {
      onDeleted(result.ok ? result.data.tree : tree);
    } else {
      setError(result.error.error);
    }
  }

  const mapSpeciesDiffers = tree !== null && tree.speciesId !== entry.speciesId;

  return (
    <li className="rounded-lg border border-border bg-bg p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold text-fg">Tree #{entry.treeNumber}</p>
        <p className="text-xs text-muted">Updated {formatDate(entry.updatedAt)}</p>
      </div>
      <p className="text-sm text-fg">Your species: {speciesName(entry.speciesId)}</p>
      {tree ? (
        <p className="text-xs text-muted">
          {mapSpeciesDiffers ? `Map shows: ${speciesName(tree.speciesId)}. ` : ""}
          Based on {tree.readingCount} {tree.readingCount === 1 ? "entry" : "entries"}.
        </p>
      ) : null}

      {mode.kind === "view" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={smallButton}
            onClick={() => onShowOnMap(tree?.lat ?? entry.lat, tree?.lng ?? entry.lng)}
          >
            Show on map
          </button>
          <button type="button" className={smallButton} onClick={startEdit}>
            Edit
          </button>
          <button type="button" className={smallButton} onClick={() => setMode({ kind: "confirmDelete" })}>
            Delete
          </button>
        </div>
      ) : null}

      {mode.kind === "edit" ? (
        <div className="mt-3 border-t border-border pt-3">
          <label htmlFor={speciesInputId} className="block text-sm font-medium text-fg">
            Species
          </label>
          <div className="mt-1">
            <SpeciesPicker inputId={speciesInputId} value={species} onChange={setSpecies} />
          </div>

          {canMove ? (
            <div className="mt-3">
              <label htmlFor={moveId} className="flex items-start gap-2 text-sm text-fg">
                <input
                  id={moveId}
                  type="checkbox"
                  checked={moveHere}
                  onChange={(event) => {
                    setMoveHere(event.target.checked);
                    if (event.target.checked) location.start();
                  }}
                  className="mt-1"
                />
                Also move my entry to where I&apos;m standing now
              </label>
              {moveHere ? (
                <div className="mt-2 rounded-md border border-border px-3 py-2 text-xs" aria-live="polite">
                  <LocationLine status={status} position={position} accurate={accurate} onCampus={onCampus} onRetry={location.start} />
                </div>
              ) : null}
            </div>
          ) : null}

          <p className="mt-3 text-xs text-muted">
            The tree number can&apos;t be changed. If it&apos;s wrong, delete this entry and add the tree again.
          </p>
          {error ? (
            <p className="mt-2 text-sm text-status-archived" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={primaryButton}
              disabled={working || (moveHere && (!accurate || !onCampus))}
              onClick={() => void save()}
            >
              {working ? "Saving…" : "Save"}
            </button>
            <button type="button" className={smallButton} onClick={() => setMode({ kind: "view" })}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {mode.kind === "confirmFar" ? (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm text-fg">{mode.message}</p>
          {error ? <p className="mt-2 text-sm text-status-archived">{error}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={primaryButton}
              disabled={working}
              onClick={() => void saveWithLocation({ ...mode.input, confirmFar: true })}
            >
              {working ? "Saving…" : `Yes, it's #${entry.treeNumber}`}
            </button>
            <button type="button" className={smallButton} onClick={() => setMode({ kind: "edit" })}>
              Go back
            </button>
          </div>
        </div>
      ) : null}

      {mode.kind === "confirmDelete" ? (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm text-fg">
            Delete your entry for tree #{entry.treeNumber}? This can&apos;t be undone.
            {tree && tree.readingCount === 1 ? " It's the only entry, so the tree will disappear from the map." : ""}
          </p>
          {error ? (
            <p className="mt-2 text-sm text-status-archived" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={working}
              onClick={() => void remove()}
              className="rounded-full border border-status-archived px-4 py-1.5 text-sm font-medium text-status-archived transition-colors hover:bg-surface-2 disabled:opacity-50"
            >
              {working ? "Deleting…" : "Delete"}
            </button>
            <button type="button" className={smallButton} onClick={() => setMode({ kind: "view" })}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}
