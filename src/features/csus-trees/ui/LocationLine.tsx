"use client";

import { MAX_ACCURACY_M } from "@/features/csus-trees/model";
import type { LocationStatus, UserPosition } from "@/features/csus-trees/ui/hooks";

// One line describing the device's location for adding or moving an entry:
// blocked, searching, off campus, not accurate enough yet, or ready.

export function LocationLine({
  status,
  position,
  accurate,
  onCampus,
  onRetry,
}: {
  status: LocationStatus;
  position: UserPosition | null;
  accurate: boolean;
  onCampus: boolean;
  onRetry: () => void;
}) {
  if (status === "denied") {
    return (
      <p className="text-status-archived">
        Location is blocked for this site. Allow location in your browser&apos;s settings, then reload the page.
      </p>
    );
  }
  if (status === "unsupported") {
    return <p className="text-status-archived">This browser can&apos;t share your location.</p>;
  }
  if (status === "idle") {
    return (
      <button type="button" onClick={onRetry} className="text-accent underline">
        Share my location
      </button>
    );
  }
  if (!position) {
    return (
      <p className="text-muted">
        {status === "unavailable" ? "Couldn't find your location yet. Keep the page open…" : "Finding your location…"}
      </p>
    );
  }
  const metres = Math.round(position.accuracyM);
  if (!onCampus) {
    return <p className="text-status-archived">You&apos;re outside the Sacramento State campus (accuracy &plusmn;{metres} m).</p>;
  }
  if (!accurate) {
    return (
      <p className="text-muted">
        Waiting for a more accurate GPS reading: &plusmn;{metres} m now, needs {MAX_ACCURACY_M} m or better. Moving out
        from under branches helps.
      </p>
    );
  }
  return <p className="text-accent">Location ready (&plusmn;{metres} m).</p>;
}
