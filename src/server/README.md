# Shared backend

Code here is the centralized backend that every project can use. It only runs on the server (files import `server-only`, so importing them into a browser component fails the build).

Current contents:

- `env.ts` validated environment variables
- `email.ts` sending mail through Brevo
- `turnstile.ts` Cloudflare Turnstile verification
- `rate-limit.ts` simple in-memory rate limiting
- `docs.ts` reads and renders the Markdown documentation
- `supabase.ts` Supabase client that acts as the signed-in visitor (reads their session cookies)
- `supabase-admin.ts` Supabase client with the secret key (bypasses row level security; use only after checking the caller)
- `caller.ts` `getCaller()`: who is making this request (user id, admin, blocked), confirmed with Supabase

Sign-in sessions are refreshed by `getCaller()` inside route handlers, so there is no proxy (middleware). Add one only if Server Components need to read the signed-in user.

Planned, added when the first project needs them:

- `db/` shared database clients (MongoDB first, SQL later), created once and reused

Code in this folder must never import from `@/features` or `@/app`.
