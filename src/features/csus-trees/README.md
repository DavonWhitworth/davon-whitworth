# CSUS-Trees

Map of Sacramento State campus trees. Anyone can view; signed-in users add and label trees.

```
src/features/csus-trees/
  model.ts         shapes, limits and rules shared by the browser and the server
  server/rows.ts   database row types and row -> API mappers (server only)
  server/db.ts     database queries (admin client; callers check access first)
  server/api.ts    request handling for the API routes
  ui/              (to come) map and add flow
```

Database: `supabase/migrations/0002_trees.sql`.

- `tree_readings`: one reading per user per tree number. Private; only the server writes it.
- `production_trees`: one row per tree number, calculated from all readings. Public; only the database's `recalc_tree()` writes it, automatically, whenever a reading is added, changed or deleted.

## API

All routes live under `src/app/api/csus-trees/` and only call into this feature. Every error returns `TreeErrorResponse` (`{ error, code, distanceM? }`).

| Method and path | Who | Body | Success |
| --- | --- | --- | --- |
| `GET /api/csus-trees/trees` | anyone | none | `ListTreesResponse` |
| `GET /api/csus-trees/readings` | signed in | none | `ListMyReadingsResponse` (caller's own) |
| `PUT /api/csus-trees/readings/{treeNumber}` | signed in, not blocked | `ReadingInput` | `SaveReadingResponse` |
| `DELETE /api/csus-trees/readings/{treeNumber}` | signed in, not blocked | none | `DeleteReadingResponse` |

`PUT` adds the caller's reading for that number, or replaces it if they already have one. The number in the path is the reading's number and can't be changed; to fix a wrong number, delete and re-add. Leading zeros in the path are ignored.

Order of checks on `PUT`: signed in (401) -> not blocked (403) -> rate limit (429) -> number (400) -> body shape (400) -> `checkReading()` (400) -> more than 40 m from where the tree is already mapped, without `confirmFar` (409 `far_from_tree` with `distanceM`) -> save.

The 409 is a mistyped-number check: the page asks "Is #N really the tree you meant?" and resends with `confirmFar: true` if the user says yes. Confirmed far readings are saved. The calculation keeps one stray reading from moving a tree: with two readings more than 20 m apart, the tree stays at the older one; with three or more, the median and 20 m trim follow the majority.

Saves and deletes share a limit of 120 per user per hour (in-memory, per server instance). Responses are never cached. If `SUPABASE_SECRET_KEY` is missing, every route answers 503.

Admin moderation (ban a user, delete their readings) comes later; deleting their readings recalculates every affected tree automatically.
