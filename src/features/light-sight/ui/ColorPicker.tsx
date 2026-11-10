import { ColorButton } from "./ColorButton";
import { CUSTOM_COLOR_NAME, lightColors, type LightColor } from "./colors";
import { CustomColorButton } from "./CustomColorButton";

interface ColorPickerProps {
  selected: LightColor | null;
  onSelect: (color: LightColor) => void;
  /** The visitor's custom color, kept even while another color is selected. */
  customValue: string;
  onCustomChange: (hex: string) => void;
}

export function ColorPicker({
  selected,
  onSelect,
  customValue,
  onCustomChange,
}: ColorPickerProps) {
  return (
    <div
      role="group"
      aria-label="Screen color"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      {lightColors.map((color) => (
        <ColorButton
          key={color.name}
          color={color}
          selected={selected?.name === color.name}
          onSelect={onSelect}
        />
      ))}
      <CustomColorButton
        value={customValue}
        selected={selected?.name === CUSTOM_COLOR_NAME}
        onChange={onCustomChange}
      />
    </div>
  );
}
