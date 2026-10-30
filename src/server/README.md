# Shared backend

Code here is the centralized backend that every project can use. It only runs on the server (files import `server-only`, so importing them into a browser component fails the build).

Current contents:

- `env.ts` validated environment variables
- `email.ts` sending mail through Resend
- `turnstile.ts` Cloudflare Turnstile verification
- `rate-limit.ts` simple in-memory rate limiting
- `docs.ts` reads and renders the Markdown documentation

Planned, added when the first project needs them:

- `auth/` Auth.js with Google sign-in (shared by every project that has accounts)
- `db/` shared database clients (MongoDB first, SQL later), created once and reused

Code in this folder must never import from `@/features` or `@/app`.
