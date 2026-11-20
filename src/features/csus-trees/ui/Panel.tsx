"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

// A panel that floats over the map (a bottom sheet on phones, a side panel on
// wider screens). The map stays mounted underneath, so closing the panel is
// instant and nothing reloads. Closes on the X button or Escape.

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Panel({ title, onClose, children }: Props) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus into the panel when it opens, for keyboard and screen readers.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <section
      aria-labelledby={headingId}
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex max-h-[75dvh] flex-col rounded-t-card border border-border bg-surface shadow-2xl sm:inset-x-auto sm:top-20 sm:bottom-auto sm:left-4 sm:max-h-[calc(100dvh-7rem)] sm:w-96 sm:rounded-card"
    >
      <header className="flex items-center justify-between gap-3 border-b border-border py-2 pr-2 pl-4">
        <h2 ref={headingRef} id={headingId} tabIndex={-1} className="text-lg font-semibold text-fg outline-none">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <div className="overflow-y-auto p-4">{children}</div>
    </section>
  );
}
