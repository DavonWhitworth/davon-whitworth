# Features

One folder per project. Each project owns its own UI and (if it has one) its own backend code:

```
src/features/<project-slug>/
  ui/       React components for this project
  server/   Backend logic for this project (queries, validation, business rules)
  README.md
```

Rules (enforced by ESLint, see `eslint.config.mjs`):

1. A feature may import from `@/server`, `@/components` and `@/content`.
2. A feature must never import from another feature.
3. A feature must never import from `@/app`.

Routes stay thin. A page lives in `src/app/...` and an API route lives in `src/app/api/<name>/route.ts`; both only call into the feature's code. Use `@/` imports (not long relative paths) so the boundary rules can see them.

To add a project: create the folder here, add an entry to `src/content/projects.ts`, and add pages under `src/app`.
