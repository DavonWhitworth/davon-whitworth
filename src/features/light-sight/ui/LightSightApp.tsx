"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { ColorPicker } from "./ColorPicker";
import {
  CUSTOM_COLOR_NAME,
  DEFAULT_CUSTOM_COLOR,
  type LightColor,
} from "./colors";

const controlClass =
  "flex h-14 items-center justify-center rounded-full border border-border bg-surface-2 px-5 font-medium text-fg transition-colors hover:bg-border";

// All state lives here, in the component, so changing the color never touches
// the document or any other route. Leaving the page resets everything.
export function LightSightApp() {
  const [color, setColor] = useState<LightColor | null>(null);
  const [customValue, setCustomValue] = useState(DEFAULT_CUSTOM_COLOR);
  const [infoOpen, setInfoOpen] = useState(false);

  function chooseCustom(hex: string) {
    setCustomValue(hex);
    setColor({ name: CUSTOM_COLOR_NAME, value: hex });
  }

  return (
    <main
      style={color ? { backgroundColor: color.value } : undefined}
      className="relative min-h-dvh bg-bg transition-colors duration-300 motion-reduce:transition-none"
    >
      <h1 className="sr-only">Light Sight</h1>

      <Link
        href="/projects/light-sight"
        className="absolute top-4 left-4 rounded-full border border-border bg-surface/90 px-4 py-2 text-sm text-fg backdrop-blur hover:bg-surface-2"
      >
        <span aria-hidden="true">&larr; </span>About this project
      </Link>

      <div className="fixed inset-x-0 bottom-0 flex justify-center p-4">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-4 rounded-card border border-border bg-surface/90 p-4 backdrop-blur">
          <ColorPicker
            selected={color}
            onSelect={setColor}
            customValue={customValue}
            onCustomChange={chooseCustom}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setColor(null)}
              className={controlClass}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              aria-label="About Light Sight"
              aria-haspopup="dialog"
              className={`${controlClass} w-14 px-0 text-xl font-semibold`}
            >
              <span aria-hidden="true">i</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        label="About Light Sight"
      >
        <p className="text-lg leading-relaxed">
          This website can be used to illuminate your immediate environment
          using your screen, with the color of your choosing!
        </p>
        <p className="mt-4 text-sm text-muted">Made by Davon Whitworth</p>
      </Modal>
    </main>
  );
}
