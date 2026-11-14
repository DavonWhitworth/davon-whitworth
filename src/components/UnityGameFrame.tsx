"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";

// Shared page for projects that are Unity WebGL builds (2D Runner, Pop).
//
// Each build lives in public/games/<slug> and runs inside an iframe, so it
// stays separate from the rest of the site. The build only starts downloading
// after the visitor presses Play. Phones and tablets are not supported: the
// games need a keyboard.

interface UnityGameFrameProps {
  title: string;
  /** URL of the build's host page, e.g. /games/2d-runner/index.html */
  src: string;
  /** Documentation page the "About this project" link points to. */
  backHref: string;
  /** Shape of the game area. 16 by 9 for widescreen, 1 by 1 for square. */
  aspect: { width: number; height: number };
}

// "any-pointer: fine" is true when a mouse or trackpad is available.
const DESKTOP_QUERY = "(any-pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
// The server cannot know, so it renders the desktop version.
const getServerSnapshot = () => true;

export function UnityGameFrame({
  title,
  src,
  backHref,
  aspect,
}: UnityGameFrameProps) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [started, setStarted] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const ratio = aspect.width / aspect.height;

  function goFullscreen() {
    void frameRef.current?.requestFullscreen?.();
  }

  return (
    <main className="flex min-h-dvh flex-col bg-bg px-4 pb-8 pt-4 text-fg">
      <div>
        <Link
          href={backHref}
          className="inline-block rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-fg hover:text-fg"
        >
          <span aria-hidden="true">&larr; </span>About this project
        </Link>
      </div>

      <h1 className="sr-only">{title}</h1>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 pt-4">
        {!isDesktop ? (
          <p className="max-w-md text-center text-muted">
            {title} is made for desktop. Open this page on a computer with a
            keyboard to play it.
          </p>
        ) : (
          <>
            {/* Keeps the game's shape, as large as fits without scrolling. */}
            <div
              className="relative overflow-hidden rounded-card border border-border bg-[#231f20]"
              style={{
                aspectRatio: `${aspect.width} / ${aspect.height}`,
                width: `min(100%, calc((100dvh - 9rem) * ${ratio}))`,
              }}
            >
              {started ? (
                <iframe
                  ref={frameRef}
                  src={src}
                  title={title}
                  allow="fullscreen"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                  // Hand the keyboard to the game once it has loaded.
                  onLoad={() => frameRef.current?.contentWindow?.focus()}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setStarted(true)}
                    className="rounded-full bg-accent px-8 py-3 text-lg font-medium text-accent-contrast transition-colors hover:bg-accent-strong"
                  >
                    Play
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted">
              <span>If the keys don&rsquo;t respond, click inside the game.</span>
              {started ? (
                <button
                  type="button"
                  onClick={goFullscreen}
                  className="rounded-full border border-border px-4 py-1.5 transition-colors hover:border-fg hover:text-fg"
                >
                  Fullscreen
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
