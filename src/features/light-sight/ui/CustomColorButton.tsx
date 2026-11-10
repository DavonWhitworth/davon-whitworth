"use client";

import { swatchSizeClass } from "./ColorButton";

interface CustomColorButtonProps {
  /** The visitor's custom color as a hex string such as "#ff69b4". */
  value: string;
  selected: boolean;
  onChange: (hex: string) => void;
}

// A round swatch that opens the device's own color picker. It is a native
// <input type="color">, laid invisibly over a decorative circle, so keyboard,
// screen reader and touch behavior all come from the browser.
export function CustomColorButton({
  value,
  selected,
  onChange,
}: CustomColorButtonProps) {
  return (
    <div
      style={{
        background: selected
          ? value
          : "conic-gradient(#ff2d2d, #ffe81a, #22e05a, #2dd7ff, #2d6bff, #a64dff, #ff2d2d)",
      }}
      className={`${swatchSizeClass} relative rounded-full border-2 border-black/30 transition-transform hover:scale-105 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent motion-reduce:transition-none ${
        selected ? "ring-2 ring-fg ring-offset-2 ring-offset-surface" : ""
      }`}
    >
      {selected ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-semibold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.7)]"
        >
          +
        </span>
      )}
      <input
        type="color"
        value={value}
        aria-label="Custom color"
        title="Custom color"
        // Choosing the swatch applies the current custom color straight away,
        // so picking the exact starting color still works.
        onClick={() => onChange(value)}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
      />
    </div>
  );
}
