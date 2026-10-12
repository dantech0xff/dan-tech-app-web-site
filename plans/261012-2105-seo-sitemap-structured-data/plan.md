# Sitemap, SEO and llms.txt generated at build time

Status: done · Created 2026-10-12

## Outcome
Everything a search engine or a language model reads is produced when the static site is built: sitemap, robots,
per-page metadata, structured data and `llms.txt`, with tests that cover every page the sitemap lists.

## What already existed (audited first)
`src/app/sitemap.ts` and `robots.ts` (both static, the new game page is in the sitemap), and `pageMetadata()` with
title, description, canonical, Open Graph and Twitter tags on every page. Missing: structured data (no JSON-LD on any
page), explicit robots/large-preview tags, and tests for any of it.

## Decisions
- JSON-LD from the site's own content, in the static HTML: Organization and WebSite on every page (founder and profiles
  are already public in the footer, FAQ and privacy policy), BreadcrumbList on inner pages, two MobileApplication nodes
  on Products (free to download, as the FAQ says), FAQPage, and a VideoGame for the game with no offer, rating or date.
- Page names for breadcrumbs live in `pageNames` (routes.ts), typed so a route cannot be added without one.
- Robots tags are set in `pageMetadata()`, not the root layout, so the 404 page keeps a single `noindex`.
- No `lastmod` in the sitemap: the Docker build has no git history, file dates are the deploy time, and a date that
  is not reliable is ignored by search engines.
- `llms.txt` (llmstxt.org) is a static route handler fed by the same content as the pages: page descriptions moved into
  `src/content/pages.ts` (one source for the meta description and the llms.txt line), apps and store links as before.
  It leaves the email out, like the JSON-LD. nginx gets `charset utf-8` so the accented letters in it are read correctly
  (checked with the production nginx image).
- Not done, offered instead: 1200x630 share images (the cards use a 512px square).

## Phases
1. [x] Audit the built output: sitemap, robots, head of every page.
2. [x] `src/lib/structured-data.ts`, `components/json-ld.tsx`, `pageNames`, shared app descriptions in `content/products.ts`.
3. [x] Wire the markup into the layout and every page; robots tags in `pageMetadata()`.
4. [x] Tests: `tests/seo.spec.ts` (every sitemap page), `tests/structured-data.unit.spec.ts`, JSON-LD added to the game
   page's banned-word scan.
5. [x] Docs: README (SEO), codebase summary, design guidelines, deployment guide.
6. [x] `llms.txt`: `src/lib/llms.ts`, `src/app/llms.txt/route.ts`, `pageDescriptions`, nginx charset, tests
   (`llms.unit.spec.ts`, a served-and-linked check in `seo.spec.ts`, shared `copy-rules.ts`).
7. [x] Verify: lint, typecheck, build, 102 tests; titles, descriptions and share tags identical to production; visible text
   identical except Cloudflare's email masking; headers checked through the production nginx image.

## Acceptance criteria
- Sitemap lists every route once as the canonical URL; robots names the sitemap; 404 stays `noindex` and out of the sitemap.
- Every page: unique title (10-65 chars), description (50-160), matching Open Graph tags, valid JSON-LD that refers to the studio.
- `llms.txt` is served as UTF-8 text, lists every page, links that all resolve, and has no email address.
- The game's markup passes the banned-word and no-promise checks.

## Open questions
- Share images at 1200x630 (a branded one for the site and one for the game)?
