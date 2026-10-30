import { readdirSync } from "node:fs";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Every folder in src/features is one project. A project may import from the
// shared layers (src/server, src/components, src/content) but never from
// another project. This keeps each project's backend cleanly separable.
const features = readdirSync(new URL("./src/features", import.meta.url), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const featureBoundaries = features.map((name) => {
  const otherFeatures = features.filter((other) => other !== name);
  const patterns = [
    {
      group: ["@/app/**"],
      message: "Features must not import from the app layer.",
    },
  ];
  if (otherFeatures.length > 0) {
    patterns.push({
      group: otherFeatures.flatMap((other) => [
        `@/features/${other}`,
        `@/features/${other}/**`,
      ]),
      message:
        "Features must not import from other features. Move shared code to src/server or src/components.",
    });
  }
  return {
    files: [`src/features/${name}/**/*.{ts,tsx}`],
    rules: { "no-restricted-imports": ["error", { patterns }] },
  };
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...featureBoundaries,
  {
    // Shared layers must never depend on a specific project or on routing.
    files: [
      "src/server/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/content/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**", "@/app/**"],
              message:
                "Shared code must not import from features or the app layer.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
