"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name announced when the dialog opens. */
  label: string;
  children: ReactNode;
}

// A modal built on the native <dialog> element. The browser provides the focus
// trap, makes the rest of the page inert, closes on Escape, and returns focus
// to the button that opened it. It also closes on the X button and when the
// backdrop (the area outside the box) is clicked.
export function Modal({ open, onClose, label, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // The dialog has no padding, so a click whose target is the dialog element
  // itself can only have landed on the backdrop.
  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClick={onBackdropClick}
      onClose={onClose}
      className="m-auto w-[min(92vw,28rem)] rounded-card border border-border bg-surface p-0 text-fg backdrop:bg-black/60"
    >
      <div className="relative p-6 pr-16">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {children}
      </div>
    </dialog>
  );
}
