# Roadmaps — Product truth

> Inferred from the code and content (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `roadmaps`) on 2026-10-23.

## What it is

A static reference site with three authored career learning roadmaps: Product Manager, Web Developer and Data
Scientist. Each one has a category, difficulty, time estimate, prerequisites, a short description and four stages of
items.

## Who it is for

A portfolio visitor who wants a calm, printable-feeling overview of a learning route.

## What works today

1. `/` and `/roadmaps` list every roadmap (sorted by marked progress) with its stage and prerequisite counts.
2. `/roadmaps/<slug>` shows one roadmap: description, prerequisites and every stage in order. Pages are prebuilt;
   an unknown slug returns 404.
3. `/api/mcp` answers JSON-RPC with `get_all`, `get_by_slug` and `search` over the same content, echoes the request
   id, and returns JSON-RPC errors for unknown tools, unknown methods and bad JSON.
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No public product roadmap, status columns, feature voting or changelog integration (the card claimed these; the
  2026-10 review flagged them).
- The progress percentages are authored sample metadata, not anyone's tracked progress. No account, storage, sync or
  editing in the browser.

## Live URL and deploy state

- Live: https://roadmaps.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-roadmaps-frontend` is deployed only by CLI. The last production deploy is the
  CVE patch (2026-10-23 12:19, CLI, commit 7ec6537). Its Git link names the old repository
  (`bookchaowalit/bookchaowalit-roadmaps-frontend`), so a push to `main` does not deploy: the L2 commits (real MCP
  tools, rendered descriptions, Sentry) stay undeployed until the owner reconnects Vercel Git to this repository
  (owner action D9). Until then the live `/api/mcp` still answers the old template's sample entry.
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `devtools-roadmaps-web`, org `personal-yu0`).

## Boundaries

- Read-only: content changes only through commits to `content/roadmaps/`.
