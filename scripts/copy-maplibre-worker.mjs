// MapLibre GL JS 6 runs its map processing in a separate worker script that
// the bundler does not include. Copy it into public/ so the site serves it at
// /vendor/maplibre-gl-worker.mjs (see src/features/csus-trees/ui/TreeMap.tsx).
// Runs before `pnpm dev` and `pnpm build`; the copy is not committed.
import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(
  new URL("../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url),
);
const targetDir = fileURLToPath(new URL("../public/vendor/", import.meta.url));

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, `${targetDir}maplibre-gl-worker.mjs`);
