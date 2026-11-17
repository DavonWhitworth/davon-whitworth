"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./supabase-browser";

// Small sign-in control for the header corner.
// Signed out: a person icon that starts Google sign-in.
// Signed in: the visitor's initial, with a small menu to sign out.
// The signed-in state lives in the browser on purpose: reading it on the
// server would make every page dynamic and lose static caching.

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

const iconButton =
  "flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg";

export function AuthButton() {
  const supabase = getSupabaseBrowser();
  // undefined = still checking, null = signed out.
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) return;
    // Fires once straight away with the current session, then on every change.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Sign-in is not configured: show nothing rather than a broken button.
  if (!supabase) return null;

  // Reserve the space while checking so the header does not jump.
  if (user === undefined) {
    return <span className="inline-block h-8 w-8" aria-hidden="true" />;
  }

  async function signIn() {
    if (!supabase) return;
    const next = window.location.pathname + window.location.search;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  async function signOut() {
    if (!supabase) return;
    setOpen(false);
    await supabase.auth.signOut();
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={signIn}
        className={iconButton}
        aria-label="Sign in with Google"
        title="Sign in with Google"
      >
        <PersonIcon />
      </button>
    );
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "Signed in";
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`${iconButton} text-sm font-medium text-fg`}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {initial}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-border bg-surface p-2 text-sm shadow-lg"
        >
          <p className="truncate px-2 py-1 text-muted">{name}</p>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="w-full rounded-md px-2 py-1.5 text-left text-fg hover:bg-surface-2"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
