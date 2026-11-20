"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import type { ProductionTree } from "@/features/csus-trees/model";
import { AddTreeModal } from "@/features/csus-trees/ui/AddTreeModal";
import { fetchTrees } from "@/features/csus-trees/ui/api";
import { useSignedIn, useUserLocation } from "@/features/csus-trees/ui/hooks";
import { TreeMap, type MapFocus } from "@/features/csus-trees/ui/TreeMap";

// The whole CSUS-Trees app: full-screen map, "you are here" dot, and the
// "Add a tree" dialog. The trees come from /api/csus-trees/trees.

const pill =
  "rounded-full border border-border bg-surface/90 px-4 py-2 text-sm text-fg shadow-lg backdrop-blur hover:bg-surface-2";

function LocateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
    </svg>
  );
}

function upsertTree(trees: ProductionTree[], tree: ProductionTree): ProductionTree[] {
  const others = trees.filter((t) => t.treeNumber !== tree.treeNumber);
  return [...others, tree];
}

export function CsusTreesApp() {
  const [trees, setTrees] = useState<ProductionTree[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [followUserKey, setFollowUserKey] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const location = useUserLocation();
  const signedIn = useSignedIn();

  useEffect(() => {
    let cancelled = false;
    fetchTrees().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setTrees(result.data.trees);
        setLoadError(null);
      } else {
        setLoadError(result.error.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  function locateMe() {
    location.start();
    setFollowUserKey((key) => key + 1);
  }

  function openAdd() {
    // Ask for location as part of the tap, so the browser shows its prompt now.
    location.start();
    setAddOpen(true);
  }

  function onSaved(tree: ProductionTree, created: boolean) {
    setTrees((current) => upsertTree(current, tree));
    setFocus({ lat: tree.lat, lng: tree.lng, zoom: 18, key: Date.now() });
    setNotice(created ? `Tree #${tree.treeNumber} added. Thank you!` : `Your entry for tree #${tree.treeNumber} was updated.`);
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg">
      <h1 className="sr-only">CSUS-Trees: map of Sacramento State campus trees</h1>

      <TreeMap trees={trees} userPosition={location.position} focus={focus} followUserKey={followUserKey} />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4">
        <Link href="/projects/csus-trees" className={`pointer-events-auto ${pill}`}>
          <span aria-hidden="true">&larr; </span>About this project
        </Link>
        <div className="pointer-events-auto rounded-full bg-surface/90 p-1 shadow-lg backdrop-blur">
          <AuthButton />
        </div>
      </div>

      {/* Messages */}
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-col items-center gap-2 px-4" aria-live="polite">
        {loadError ? (
          <div className={`pointer-events-auto ${pill} flex items-center gap-3`}>
            <span>{loadError}</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="text-accent underline">
              Retry
            </button>
          </div>
        ) : null}
        {notice ? <p className={pill}>{notice}</p> : null}
        {location.status === "denied" ? (
          <p className={`${pill} max-w-sm text-center`}>
            Location is blocked for this site. Allow it in your browser settings to see where you are.
          </p>
        ) : null}
      </div>

      {/* Bottom controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 pb-8">
        <button
          type="button"
          onClick={locateMe}
          aria-label="Show my location"
          title="Show my location"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface/90 text-fg shadow-lg backdrop-blur hover:bg-surface-2"
        >
          <LocateIcon />
        </button>
        <button
          type="button"
          onClick={openAdd}
          aria-haspopup="dialog"
          className="pointer-events-auto h-14 rounded-full bg-accent px-7 text-base font-semibold text-accent-contrast shadow-lg transition-colors hover:bg-accent-strong"
        >
          + Add a tree
        </button>
        {/* Keeps the Add button centered; the zoom buttons sit at bottom right. */}
        <span className="h-12 w-12" aria-hidden="true" />
      </div>

      <AddTreeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        signedIn={signedIn}
        location={location}
        onSaved={onSaved}
      />
    </main>
  );
}
