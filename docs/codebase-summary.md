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
`products.ts`, `faq.ts`, `idle-ai-tycoon.ts` for the whole game page); one-off prose stays in the page components.

## Tests (`tests/`)

- `site.spec.ts` — every page renders without console errors (also with the clock a year past the build);
  per-page share metadata; active nav state; product deep links, same-page links and direct hash visits land
  below the sticky header (including the wrapped mobile header); reduced motion; new pages open at the top;
  FAQ accordion; contact mailto contents and focus; newsletter fallback; 404 status. The game page has its own group: share
  card and sitemap entry, "coming soon" with no store link, no ads/purchase/upgrade words (text and alt texts), the hero link
  below the sticky header, every picture and the pixel font served, hard-edged pixel art, and the font preloaded on that page only.
- `mailto-and-newsletter.unit.spec.ts` — mailto builders and the endpoint client (no browser).

Runs on desktop Chrome and a Pixel 7 profile against the static export.
