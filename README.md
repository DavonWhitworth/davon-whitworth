# Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Netlify.

## Quick start

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm dev        # http://localhost:3000
```

Then `pnpm build` to confirm a production build works.

Copy `.env.example` to `.env.local` and fill it in. Without email variables, the contact form logs messages to the terminal in development.

## URL rules

| URL | What it is |
| --- | --- |
| `/` | Landing page: technologies, project grid, contact |
| `/projects/<slug>` | A project's page, which is its documentation |
| `/<slug>` | The app itself, for projects that run on this site (for example `/light-sight`) |
| `/projects` | Redirects to the project grid on the home page |
| anything else | 404 page with a link back home |

Every card on the landing page opens `/projects/<slug>`. Projects on their own domain set `externalUrl` in the registry; their project page shows a "Visit" button that opens the site in a new tab.

App pages are marked `noindex`; the documentation pages are the ones search engines should find.

Root URLs are shared by every app, so avoid slugs that collide with real routes or pages you may want later: `projects`, `api`, `about`, `blog`, `resume`, `contact`, `sitemap.xml`, `robots.txt`.

## Structure

```
src/
  app/
    page.tsx                Landing page
    projects/[slug]/        Project page = documentation
    (apps)/<slug>/          The app itself at /<slug> (the group adds no URL segment)
    api/contact/            Contact form endpoint
    sitemap.ts, robots.ts   SEO
  components/     Shared UI
  content/        site.ts, profile.ts, projects.ts, docs/*.md
  features/       One folder per project (own UI + own backend code)
  server/         Shared backend: env, email, rate limit, docs rendering
```

Boundary rules (ESLint): a feature never imports from another feature or from `src/app`; shared folders never import from features. See `src/features/README.md`.

## Common tasks

- **Edit your text:** `src/content/site.ts` and `src/content/profile.ts` (search for `TODO`).
- **Add a project:** add an entry to `src/content/projects.ts`. The order of that list is the order of the grid.
- **Add documentation:** create `src/content/docs/<slug>.md` with `title` and `description` frontmatter. `##` and `###` headings become the table of contents on `/projects/<slug>`.
- **Run a project's app on this site:** set `hasApp: true` on its registry entry, put the page at `src/app/(apps)/<slug>/page.tsx`, and put its code in `src/features/<slug>/`.
- **Change colors:** the `@theme` block in `src/app/globals.css`.
- **Resume:** put a PDF at `public/resume.pdf`. The download button appears when it exists.

## Deploying to Netlify

1. Push the repo to GitHub and import it in Netlify (it detects Next.js).
2. Add the variables from `.env.example` under Site configuration > Environment variables, and set `NEXT_PUBLIC_SITE_URL` to your real domain.
3. For the contact form, create a Resend account, verify a sending domain, and create a Cloudflare Turnstile widget.

## Not included yet

Authentication, databases and the larger projects (tree map, shopping list) are intentionally left out. Their places are described in `src/server/README.md`.
