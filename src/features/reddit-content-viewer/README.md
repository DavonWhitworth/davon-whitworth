# Reddit Content Viewer

Planned. Reads the public JSON data that Reddit exposes on its URLs.

- `ui/` the viewer components
- `server/` the fetch-and-cache logic used by an API route (browsers cannot call Reddit directly because of CORS, so requests go through a route such as `src/app/api/reddit/route.ts`)
