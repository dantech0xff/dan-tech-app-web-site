# dantech.app

Website of **Dan Tech Indiv.** — a one-person mobile app studio from Vietnam (Duoly in Love, Kim Tài · Tick Vàng Online).
It is a pixel-faithful build of the Claude Design project "Dan Tech Landing Page Design" (`dantech.app.dc.html`),
plus one page that is not in that design: the landing page of the game Garage to AGI.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, exported as a fully static site (`output: "export"`).
- CSS Modules plus global design tokens in `src/app/globals.css`; no CSS framework.
- Fonts, all self-hosted: Be Vietnam Pro and IBM Plex Mono through `next/font`; Material Symbols Outlined as an 18 KB subset of the icons the site uses and Jersey 10 (the game's pixel font, 5 KB, preloaded by its page only), both in `public/fonts/`.
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
| `npm run share-images` | Re-renders the 1200×630 share cards in `public/assets/share/` from the HTML templates in `scripts/share-images/` (needs the network for Google Fonts). Commit the result. |

Playwright needs its Chromium build once: `npx playwright install chromium`.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | No | URL that receives newsletter sign-ups as `POST` JSON `{ "email": "…" }` (Formspree, a Buttondown proxy, a Supabase function…). When unset, Subscribe opens the visitor's mail app with a sign-up request to admin@dantech.app. |

Set it at build time (it is inlined into the static bundle), e.g. in `.env.local`.

## Pages

`/` · `/products/` (anchors `#duoly`, `#kim-tai`, `#earlier`) · `/about/` · `/contact/` · `/faq/` · `/privacy/` · `/terms/` · `/idle-ai-tycoon/` (the Garage to AGI game; sections `#gameplay`, `#worlds`, `#moments`, `#collect`, `#events`), plus a 404 page, `sitemap.xml`, `robots.txt` and `app-ads.txt`. URLs end with a slash (`trailingSlash: true`).

The game page is in the sitemap but not in the header, footer or Products page. It says "Coming soon to Google Play" with no store link: add the link and change the status line in `src/content/idle-ai-tycoon.ts` when the listing is live. Rules for its copy are in [docs/design-guidelines.md](docs/design-guidelines.md#garage-to-agi-page-idle-ai-tycoon).

`public/app-ads.txt` is the file Google AdMob reads to check who may sell ads in the studio's apps; it holds the studio's AdMob line (add one line per extra ad network, only when mediation is added). AdMob finds it at `https://dantech.app/app-ads.txt` from the developer website of an app's store listing, so that listing's website must be on `dantech.app`.

The contact form has no backend: it opens the visitor's mail app with the subject and body prefilled, exactly as the design specifies.

## SEO

Everything search engines read is generated when the site is built, so it is already in the static HTML:

- `sitemap.xml` and `robots.txt` come from `src/app/sitemap.ts` and `src/app/robots.ts`. The sitemap lists every route in `src/lib/routes.ts`, so a new route is in it with no other step. It has no `lastmod` on purpose: the Docker build has no git history, so there is no honest date, and search engines ignore a date that is not reliable.
- Each page's title, description, canonical URL, Open Graph and Twitter cards and robots tags come from `pageMetadata()` in `src/lib/metadata.ts`. The 404 page keeps its `noindex`.
- Structured data (schema.org JSON-LD) is written by `src/lib/structured-data.ts` from the site's own content: the studio and the website on every page, a breadcrumb trail on every inner page, the two apps on Products, every question on FAQ and the game on its page. It states no ratings, no counts and no offer for the game.
- Share cards: `public/assets/share/site.jpg` (the studio, used by every page that has no card of its own) and `idle-ai-tycoon.png`, both 1200×630 and under 300 KB, with the `summary_large_image` Twitter card. `npm run share-images` renders them from `scripts/share-images/site.html` and `game.html` with the project's Playwright Chromium; a page picks its own with `pageMetadata({ image })`.
- `llms.txt` (the llmstxt.org guide for language models) is written to `out/llms.txt` by `src/app/llms.txt/route.ts` from `src/lib/llms.ts`: a summary of the studio, the apps with their store listings, every page with its description, and the policies. It leaves the email address out on purpose: the live site's host hides it from scrapers in the page.
- `tests/seo.spec.ts`, `tests/structured-data.unit.spec.ts` and `tests/llms.unit.spec.ts` check all of it on every page the sitemap lists.

To add a page: add its route in `src/lib/routes.ts` and its name in `pageNames` (TypeScript refuses a route without one), its description in `pageDescriptions` (`src/content/pages.ts`, used by the page's metadata and by llms.txt), export `metadata` from `pageMetadata()`, render `<JsonLd data={breadcrumbs(routes.thePage)} />` in the page and list it in `src/lib/llms.ts` (a test fails if a route is missing from llms.txt). The sitemap and the SEO tests pick it up by themselves.

## Project layout

```
src/
  app/          routes, root layout, metadata, sitemap/robots, global CSS
  components/   shared UI (header, footer, phone mockup, forms) and per-page sections
  content/      copy and data (site links, FAQ, products, home, the game page)
  lib/          routes, scroll behaviour, mailto + newsletter helpers
public/assets/  images from the design project; idle-ai-tycoon/ holds the game's pixel art
public/fonts/   self-hosted icon font subset and the game page's pixel font
scripts/        static preview server, icon font updater
tests/          Playwright specs
docs/           design guidelines, codebase summary, deployment guide
```

## Deployment

Production (https://dantech.app) runs on Dokploy behind Cloudflare: every push to `main` builds the `Dockerfile` (static export served by unprivileged nginx on port 8080) and redeploys. The current Dokploy, Cloudflare and DNS setup is in [docs/deployment-guide.md](docs/deployment-guide.md), which also covers other static hosts.

## Design fidelity

The build was checked against the original design rendered by its own runtime: identical page heights and text on every page at 1440, 1024, 768 and 390 px, matching computed styles for every element, and matching hover/focus states. Rules that keep it that way are in [docs/design-guidelines.md](docs/design-guidelines.md).

The three app-screen images (`duoly-screen-today.png`, `duoly-screen-duo.png`, `kimtai-screen-ledger.png`) were rebuilt because the design download truncated them: their upper part is the design's exact pixels, the rest comes from the App Store screenshots. Drop the design project's originals into `public/assets/` under the same names when you can download them whole.
