# Roadmaps

Three authored career learning roadmaps (Product Manager, Web Developer, Data Scientist), each a list of stages
and items with prerequisites, a short description and a marked-progress figure. The content lives in
`content/roadmaps/*.mdx` (YAML front matter plus a short Markdown body) and is prebuilt into static pages.

Live: https://roadmaps.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- Not a product roadmap tool: no status columns, feature voting or changelog.
- The progress percentages are authored sample metadata, not tracked personal progress. No account, storage or sync.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: content loading and search, Markdown renderer, pages, MCP route, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (lint, typecheck, tests with a line-coverage gate,
build) and the shared security scan on every push and PR to `main`.

## Code map

- `lib/mdx.ts`: reads and validates `content/roadmaps/*.mdx` (`getAllRoadmaps`, `getRoadmapBySlug` with a safe-slug
  check, `searchRoadmaps`).
- `lib/markdown.tsx`: a small Markdown-to-React renderer for the roadmap body (paragraphs, headings, lists,
  emphasis); HTML in the source is escaped, never injected.
- `lib/roadmap-index.tsx`: the route list shared by `/` and `/roadmaps`.
- `app/roadmaps/[slug]/page.tsx`: one prebuilt sheet per roadmap; any other slug is a 404.
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `get_all`, `get_by_slug` and `search` over the same content.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
