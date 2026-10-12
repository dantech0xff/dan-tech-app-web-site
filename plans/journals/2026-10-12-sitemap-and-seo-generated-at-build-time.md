---
title: Sitemap and SEO generated at build time
date: 2026-10-12
summary: "The sitemap and robots were already built statically; structured data, robots tags, llms.txt and SEO tests were the gap, and were added the same day."
---

# Sitemap, SEO and llms.txt generated at build time

## What happened

- The owner asked for the sitemap and SEO to be generated at build time. An audit of the built output showed `sitemap.xml` and `robots.txt` already come from `src/app/sitemap.ts` and `robots.ts` (static, and the new game page was in it), and every page already had a unique title, description, canonical URL and Open Graph and Twitter tags from `pageMetadata()`. What was missing: any structured data (no JSON-LD on any page), explicit robots tags, and tests for any of it.
- Added `src/lib/structured-data.ts` (builders that read the site's own content), `components/json-ld.tsx` and `pageNames` in `src/lib/routes.ts`. The layout writes an Organization and WebSite graph on every page, inner pages get a BreadcrumbList, Products gets the two apps (free to download, as the FAQ says), FAQ gets FAQPage and the game page gets a VideoGame with no offer, rating or date. The two app descriptions moved into `content/products.ts` so the page and the markup share them.
- `tests/seo.spec.ts` reads the sitemap and checks every page it lists (canonical, title and description length, matching share tags, unique titles, robots tags, valid JSON-LD that refers to the studio, breadcrumbs named like the title, plus the apps, FAQ and game markup). `tests/structured-data.unit.spec.ts` covers the builders and the escaping. The game page's banned-word test now scans its JSON-LD too. 96 tests pass.
- Setting `robots` in the root layout gave the 404 page two conflicting tags (Next's `noindex` and `index, follow`), so the tags (with Googlebot's large-preview directives) moved into `pageMetadata()` and the 404 page keeps its single `noindex`.
- Comparing the new build with production showed every page's visible text unchanged except `[email protected]`: Cloudflare hides the studio's email from scrapers at the edge. Plain text in the JSON-LD would undo that, so the markup carries no email and the contact point links to the Contact page.
- The owner then asked to commit, merge and push that, and to add `llms.txt` as well. It is a static route handler (`src/app/llms.txt/route.ts`) that writes `out/llms.txt` from `src/lib/llms.ts`, in the llmstxt.org layout: a summary, the apps with their store listings, every page with its description, the policies and the sitemap. To avoid copying page descriptions, they moved into `src/content/pages.ts`, which the pages' metadata and llms.txt both read (every page's title, description and share tags are identical to production). The email stays out, like the JSON-LD, and a unit test checks that every route is listed and that the game's line follows the game page's rules.
- The file has accented letters (Kim Tài) and nginx sent `text/plain` with no charset, so `nginx.conf` got `charset utf-8`. It was checked by running the production nginx image (already cached) over the new build: `llms.txt` and `robots.txt` come back as `text/plain; charset=utf-8`.
- A shell slip worth remembering: in zsh a loop variable named `path` overwrites `PATH`, which hid `curl` and `docker` and left the test container running until the next command stopped it.
- One first full test run had two `page.goto` aborts (`ERR_ABORTED`) at `/privacy/` in the new SEO tests on desktop. The same tests pass alone and four more full runs passed, so it was treated as a one-off.

## Decision

- `llms.txt` and the structured data leave out the email address, because Cloudflare masks it from scrapers in the HTML.
- No `lastmod` in the sitemap: the Docker build has no git history and file dates are the deploy time, so any date would be unreliable, and search engines ignore those.
- Page names for breadcrumbs live in one typed map, so a route cannot be added without one.
- Not done, offered instead: 1200x630 share images (the cards use a 512 px square).
- A push to `main` deploys; the owner approved this one after the full local run (lint, typecheck, 102 tests).

## Next steps

- After the deploy, check that Cloudflare leaves the JSON-LD and `llms.txt` untouched, and open a page in Google's Rich Results Test.
- Decide on share images.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
