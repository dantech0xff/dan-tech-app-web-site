# Codebase summary

## Routes (`src/app`)

| Route | File | Notes |
| --- | --- | --- |
| `/` | `page.tsx` | Composes the home sections from `src/components/home/` |
| `/products/` | `products/page.tsx` | Hero chips + Duoly, Kim Tài, Earlier work sections (`src/components/products/`) |
| `/about/` | `about/page.tsx` | Statements, four rules, tool list, contact CTA |
| `/contact/` | `contact/page.tsx` | `ContactForm` (mailto) + channels |
| `/faq/` | `faq/page.tsx` | `FaqList` accordion fed by `src/content/faq.ts` |
| `/privacy/`, `/terms/` | `privacy/page.tsx`, `terms/page.tsx` | Clauses rendered by `LegalDocument` |
| `/idle-ai-tycoon/` | `idle-ai-tycoon/page.tsx` | Garage to AGI landing page: hero, gameplay, worlds, moments, collect, weekend events (`src/components/idle-ai-tycoon/`), then the home page's `NewsletterSection` |
| 404 | `not-found.tsx` | Exported as `out/404.html` |
| `sitemap.xml`, `robots.txt` | `sitemap.ts`, `robots.ts` | Forced static for the export |

`layout.tsx` loads the text fonts, preloads the self-hosted icon font, sets default metadata, and renders `SiteHeader`, the page,
`SiteFooter` and `ScrollOnNavigate`.

## Navigation and scrolling

URLs end with a slash (`trailingSlash: true`; route constants in `src/lib/routes.ts`), so the export is
`about/index.html` and works on any static host. `isSamePath` compares paths with or without the slash.

`SiteLink` wraps `next/link` with `scroll={false}`:

- to another page: records a scroll intent for that path (`src/lib/scroll.ts`); `ScrollOnNavigate` applies it
  after the new page renders — top of page instantly, or a smooth scroll to the anchor just below the header;
- to the current page: cancels the navigation, updates the URL with `history.replaceState`, smooth-scrolls.

The clearance is 72 px on desktop and the measured header height + 3 px when the nav wraps on phones.
`ScrollOnNavigate` keeps it in `--anchor-offset` (used by `html { scroll-padding-top }`) and re-aligns a
section opened directly by URL hash. Smooth scrolling becomes instant under reduced motion. Back/forward
navigation finds no intent for its path, so the browser's own scroll restoration applies.

`src/lib/metadata.ts` builds each page's title, description, canonical URL and Open Graph/Twitter cards. A page about
one product passes its own `image` for the share card (the game page uses the app icon); the others share the studio mark.

## SEO and structured data

All of it is produced at build time and lands in the static HTML.

- `src/app/sitemap.ts` lists `Object.values(routes)` (no `lastmod`, see the README) and `src/app/robots.ts` allows everything and names the sitemap. Both are `force-static`.
- `pageMetadata()` also sets the robots tags (`index, follow` and Googlebot's large-preview directives). Only pages built with it get them, so `not-found.tsx` keeps Next's lone `noindex`; setting robots in the root layout gave the 404 page two conflicting tags.
- `src/lib/structured-data.ts` builds the JSON-LD; `components/json-ld.tsx` writes it into a `<script type="application/ld+json">` (`toJsonLd` escapes `<`, so no value can close the tag). `layout.tsx` renders `siteGraph()` (Organization with its social profiles and the founder, plus WebSite) on every page, and pages add `breadcrumbs()`, `productsGraph()`, `faqPage()` or `gamePage()`. Page nodes refer to the studio by `@id`, which resolves on the same page.
- `pageNames` in `src/lib/routes.ts` names each page in breadcrumbs; a page's `<title>` starts with its name (a test checks it). `apps` in `content/products.ts` is where the two apps' names and descriptions live, read by the products page and by the markup.

## Client components

`nav-links.tsx` (active-page dot), `site-link.tsx`, `scroll-on-navigate.tsx`, `current-year.tsx`,
`contact-form.tsx`, `faq-list.tsx`, `home/newsletter-form.tsx`. Everything else renders at build time.

## Styling

Global tokens and animation utilities live in `src/app/globals.css`; each area has a CSS Module
(`home/home.module.css`, `products/products.module.css`, `about.module.css`, `idle-ai-tycoon/game.module.css`, …) and
shared atoms are in `components/ui.module.css`. The static export ships one stylesheet to every page, so a module's rules
reach pages that do not use them. See [design-guidelines.md](design-guidelines.md).

## Content

Copy that repeats or is data-like sits in `src/content/` (`site.ts` links and socials, `home.ts`,
`products.ts`, `faq.ts`, `idle-ai-tycoon.ts` for every word of the game page); one-off prose stays in the page components.

## Tests (`tests/`)

- `site.spec.ts` — every page renders without console errors (also with the clock a year past the build);
  per-page share metadata; active nav state; product deep links, same-page links and direct hash visits land
  below the sticky header (including the wrapped mobile header); reduced motion; new pages open at the top;
  FAQ accordion; contact mailto contents and focus; newsletter fallback; 404 status. The game page has its own group: share
  card and sitemap entry, "coming soon" with no store link, no ads/purchase/upgrade words (text and alt texts), the hero link
  below the sticky header, every picture and the pixel font served, hard-edged pixel art, and the font preloaded on that page only.
- `seo.spec.ts` — for every page the sitemap lists: canonical address, title and description length, share tags that match, unique titles, robots tags, valid JSON-LD that points at the studio, breadcrumbs named like the title, and the page-specific markup (apps, FAQ, game). Also `robots.txt` and the 404 `noindex`.
- `structured-data.unit.spec.ts` and `mailto-and-newsletter.unit.spec.ts` — pure logic (no browser): the JSON-LD builders and their escaping, the mailto builders and the endpoint client.

Runs on desktop Chrome and a Pixel 7 profile against the static export.
