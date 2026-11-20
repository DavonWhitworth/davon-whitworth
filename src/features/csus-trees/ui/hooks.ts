"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getSupabaseBrowser } from "@/components/auth/supabase-browser";

// ---------------------------------------------------------------------------
// The user's location
// ---------------------------------------------------------------------------

export type UserPosition = {
  lat: number;
  lng: number;
  /** GPS accuracy radius in metres, as reported by the device. */
  accuracyM: number;
  /** When the device took this reading (ms since epoch). */
  timestamp: number;
};

export type LocationStatus =
  | "idle" //        not asked yet
  | "locating" //    asked, waiting for the first reading
  | "active" //      receiving readings
  | "denied" //      the user or browser blocked location for this site
  | "unavailable" // the device couldn't get a location
  | "unsupported"; // no geolocation in this browser

/**
 * Watches the device's precise location once start() is called.
 * If the site already has location permission, it starts on its own.
 * Readings stay in the browser; they only reach the server when the user
 * saves a tree entry.
 */
export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const watchId = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
  }, []);

  const start = useCallback(() => {
    if (watchId.current !== null) return;
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus((current) => (current === "active" ? current : "locating"));
    watchId.current = navigator.geolocation.watchPosition(
      (reading) => {
        setPosition({
          lat: reading.coords.latitude,
          lng: reading.coords.longitude,
          accuracyM: reading.coords.accuracy,
          timestamp: reading.timestamp,
        });
        setStatus("active");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          stop();
          setPosition(null);
          setStatus("denied");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setStatus((current) => (current === "active" ? current : "unavailable"));
        }
        // TIMEOUT: keep watching; the next reading may succeed.
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  }, [stop]);

  useEffect(() => {
    let cancelled = false;
    // Start without a prompt only if the user already allowed this site.
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((permission) => {
        if (!cancelled && permission.state === "granted") start();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      stop();
    };
  }, [start, stop]);

  return { status, position, start };
}

// ---------------------------------------------------------------------------
// Signed in?
// ---------------------------------------------------------------------------

/** undefined while checking, then true or false. */
export function useSignedIn(): boolean | undefined {
  const supabase = getSupabaseBrowser();
  const [signedIn, setSignedIn] = useState<boolean | undefined>(supabase ? undefined : false);

  useEffect(() => {
    if (!supabase) return;
    // Fires once straight away with the current session, then on every change.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(session !== null);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  return signedIn;
}

// ---------------------------------------------------------------------------
// Touch screen?
// ---------------------------------------------------------------------------

// Adding trees is limited to touch-screen devices (phones, tablets), whose
// location comes from GPS. Laptops usually guess location from the network.
const COARSE_POINTER = "(pointer: coarse)";

function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia(COARSE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(COARSE_POINTER).matches,
    () => false,
  );
}
