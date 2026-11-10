import type { LightColor } from "./colors";

interface ColorButtonProps {
  color: LightColor;
  selected: boolean;
  onSelect: (color: LightColor) => void;
}

// Large round swatches: 48px on phones, 56px from the sm breakpoint up. Both
// are above the 44px minimum touch target.
export const swatchSizeClass = "h-12 w-12 sm:h-14 sm:w-14";

export function ColorButton({ color, selected, onSelect }: ColorButtonProps) {
  return (
    <button
      type="button"
      aria-label={color.name}
      aria-pressed={selected}
      title={color.name}
      onClick={() => onSelect(color)}
      style={{ backgroundColor: color.value }}
      className={`${swatchSizeClass} rounded-full border-2 border-black/30 transition-transform hover:scale-105 aria-pressed:ring-2 aria-pressed:ring-fg aria-pressed:ring-offset-2 aria-pressed:ring-offset-surface motion-reduce:transition-none`}
    />
  );
}
