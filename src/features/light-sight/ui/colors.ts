// Bright, saturated values: the page is meant to work as a light, so these are
// chosen for brightness and are deliberately not part of the site's soft theme.
export interface LightColor {
  name: string;
  value: string;
}

export const lightColors: readonly LightColor[] = [
  { name: "Red", value: "#ff2d2d" },
  { name: "Orange", value: "#ff8c1a" },
  { name: "Yellow", value: "#ffe81a" },
  { name: "Green", value: "#22e05a" },
  { name: "Blue", value: "#2d6bff" },
  { name: "Purple", value: "#a64dff" },
  { name: "White", value: "#ffffff" },
];

// Name given to a color the visitor picks themselves.
export const CUSTOM_COLOR_NAME = "Custom";

// Starting value shown in the custom color picker.
export const DEFAULT_CUSTOM_COLOR = "#ff69b4";
