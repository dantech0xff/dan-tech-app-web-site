# dantech.app

Website of **Dan Tech Indiv.** — a one-person mobile app studio from Vietnam (Duoly in Love, Kim Tài · Tick Vàng Online).
It is a pixel-faithful build of the Claude Design project "Dan Tech Landing Page Design" (`dantech.app.dc.html`).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, exported as a fully static site (`output: "export"`).
- CSS Modules plus global design tokens in `src/app/globals.css`; no CSS framework.
- Fonts, all self-hosted: Be Vietnam Pro and IBM Plex Mono through `next/font`; Material Symbols Outlined as an 18 KB subset of the icons the site uses (`public/fonts/`).
- Playwright for end-to-end and unit tests.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload. |
| `npm run build` | Static export into `out/`. |
| `npm run start` | Serves `out/` like a production host on http://127.0.0.1:4311 (`PORT` to change). |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules). |
| `npm run typecheck` | Generates Next route types, then `tsc --noEmit`. |
| `npm test` | Builds, serves and runs the Playwright suite (desktop + mobile). |
| `npm run clean` | Removes build and test output. |
| `npm run icons:update` | Re-downloads the icon font subset after an icon is added or removed (list in `scripts/update-icon-font.mjs`). |

Playwright needs its Chromium build once: `npx playwright install chromium`.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | No | URL that receives newsletter sign-ups as `POST` JSON `{ "email": "…" }` (Formspree, a Buttondown proxy, a Supabase function…). When unset, Subscribe opens the visitor's mail app with a sign-up request to admin@dantech.app. |

Set it at build time (it is inlined into the static bundle), e.g. in `.env.local`.

## Pages

`/` · `/products/` (anchors `#duoly`, `#kim-tai`, `#earlier`) · `/about/` · `/contact/` · `/faq/` · `/privacy/` · `/terms/`, plus a 404 page, `sitemap.xml` and `robots.txt`. URLs end with a slash (`trailingSlash: true`).

The contact form has no backend: it opens the visitor's mail app with the subject and body prefilled, exactly as the design specifies.

## Project layout

```
src/
  app/          routes, root layout, metadata, sitemap/robots, global CSS
  components/   shared UI (header, footer, phone mockup, forms) and per-page sections
  content/      copy and data (site links, FAQ, products, home)
  lib/          routes, scroll behaviour, mailto + newsletter helpers
public/assets/  images from the design project
public/fonts/   self-hosted icon font subset
scripts/        static preview server, icon font updater
tests/          Playwright specs
docs/           design guidelines, codebase summary, deployment guide
```

## Deployment

Production (https://dantech.app) runs on Dokploy behind Cloudflare: every push to `main` builds the `Dockerfile` (static export served by unprivileged nginx on port 8080) and redeploys. The current Dokploy, Cloudflare and DNS setup is in [docs/deployment-guide.md](docs/deployment-guide.md), which also covers other static hosts.

## Design fidelity

The build was checked against the original design rendered by its own runtime: identical page heights and text on every page at 1440, 1024, 768 and 390 px, matching computed styles for every element, and matching hover/focus states. Rules that keep it that way are in [docs/design-guidelines.md](docs/design-guidelines.md).

The three app-screen images (`duoly-screen-today.png`, `duoly-screen-duo.png`, `kimtai-screen-ledger.png`) were rebuilt because the design download truncated them: their upper part is the design's exact pixels, the rest comes from the App Store screenshots. Drop the design project's originals into `public/assets/` under the same names when you can download them whole.
