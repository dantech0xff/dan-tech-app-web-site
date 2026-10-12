---
title: "Garage to AGI landing page built, shipped and reviewed"
date: 2026-10-12
summary: "One page for the idle tycoon at /idle-ai-tycoon/ built from the private game repo and live on dantech.app; an independent review found two live copy errors, which were fixed the same day."
---

# Garage to AGI landing page built, shipped and reviewed

## What happened

- The owner asked for one simple page for the mobile game Garage to AGI at `dantech.app/idle-ai-tycoon`: what the game is, how it plays and what is fun about it, with no ads, no upgrades and only special features that exist in the game.
- The game repo (`dantech0xff/flutter-idle-ai-lab`) is private, so it was read with `gh api` (WebFetch returned 404 and the zread MCP was out of quota). `docs/prototype/` (design boards and the playable `Main.dc.html`) and `docs/store/listing.md` (what the first store build contains) decide what exists today. The repo's own store screenshots date from 27 Sep, before the Layer 100 ending and the font change, and its listing doc says not to publish them, so the page uses pixel art from `assets/images/` and a CSS rebuild of the loss-spike dialog. The owner holds every right to the art, marketing use included.
- Built: `src/content/idle-ai-tycoon.ts` (all copy), `src/components/idle-ai-tycoon/` (hero, gameplay, worlds, moments, collect, events and one CSS module), the route, a sitemap entry, an optional share image in `pageMetadata`, 53 art files and the self-hosted Jersey 10 font. The home page's newsletter section closes the page. The game is in Play closed testing, so the page says "Coming soon to Google Play" and links no store.
- `next/font` preloaded Jersey 10 on every page of this static export, home included, and Turbopack ships one stylesheet to every page. The font now lives in `public/fonts/` with an `@font-face` in the module and a `preload()` from `react-dom` on this route only.
- A hook blocked reading `node_modules/next/dist/docs`, which AGENTS.md asks for, so the work copied the patterns of the existing pages and was checked by lint, typecheck, build and Playwright.
- Commit 779c4ca on `feat/idle-ai-tycoon-page` was fast-forwarded into `main` and pushed at the owner's request. Dokploy deployed in about 50 s. Live checks: HTTP 200, title, og:image, assets, sitemap, the other pages still 200, home does not preload the font.
- An independent code-reviewer agent fact-checked 55 claims against the game docs in about 22 minutes. No critical issue, but two High errors were already live: copy implying new model families and products on every layer (they repeat after Layer 16, and new families are a content drop), and "a free boost" for the emergent ability, where "boost" is the game's paid x2 perk (the real effect is +2 BENCH). Four Medium: an iPhone promise, "pay now" reading like real money, Exit and Era Shift described as one step, and a banned-word test that missed metadata, alt texts, aria labels and file names. Each finding was checked against the game docs before fixing.
- The fixes were written on `fix/idle-ai-tycoon-copy-review`, and the owner then asked to commit, merge and push them: corrected copy, the iPhone line removed, all copy moved into the content file, the loss-spike picture and the hidden minds readable by assistive tech, grids that split evenly, a 256 px hero icon, a stricter test (72 pass) and corrected docs.

## Decision

- Page copy follows the owner's rules: no ads, purchases or upgrades and none of the game's paid-feature words, only features in the first store build, no counts that grow with content, and a status that only says "Coming soon to Google Play". A Playwright test enforces them.
- The page is not linked from the header, footer or Products page; it is only in the sitemap.
- Pushes to `main` deploy to production and no CI runs the tests, so the fixes were held for the owner's go-ahead and a full local run (lint, typecheck, 72 tests).

## Next steps

- Check dantech.app once the fixes are deployed: the page, its assets and the other pages.
- Owner: decide whether "pity counter" stays on the page, whether the studio newsletter belongs on it, and whether to link the page from the site.
- When the Google Play listing is live, change `game.status` and add a store button.
- Lesson: a banned-word test has to scan every surface (metadata, alt texts, aria labels, file names) and guard against checking nothing. A review that checks claims against the source found errors the author's own pass missed.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
