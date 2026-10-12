# Garage to AGI page (`/idle-ai-tycoon/`)

Status: done, live on dantech.app since 2026-10-12 · Created 2026-10-12

## Outcome
One simple, static page at `https://dantech.app/idle-ai-tycoon/` that introduces the mobile game
**Garage to AGI** (idle AI tycoon, repo `dantech0xff/flutter-idle-ai-lab`): what it is, how it plays and what
makes it fun. Built in the site's design language with the game's own pixel art.

## Content rules (owner, 2026-10-12)
- Never mention ads, purchases, subscriptions, premium currency or "upgrades". Only the game's special features.
- Only features that exist in the game today. Excluded because they are not in the app yet: weekly deepest-layer
  board, content drops, titles other players see.
- Keep content counts to the stable ones (ten products and eight models per era, twelve star hires, 100 layers);
  no counts of minds, achievements or specialists, since content grows.

## Sources (read through `gh`, repo is private)
- `docs/prototype/` boards and `Main.dc.html` (rules, labels, copy of the loss-spike dialog and its colours).
- `docs/store/listing.md`: describes what the first store build contains (reference for "exists today").
- `docs/prototype/BuildPlan.dc.html` and `CLAUDE.md` Status: design-vs-app state; the founder in the HQ, Hall of
  Minds, events, daily rewards and achievements are in the app.
- `docs/legal/art-provenance.md`: the owner holds every right to the art, marketing use included.
- Not used: `docs/store/screenshots/` (dated 27 Sep 2026, before the v20 sync and the Layer 100 ending; the repo
  says not to publish it). Real sprites and scenes from `assets/images/` instead, plus a CSS rebuild of the
  loss-spike dialog from `Main.dc.html`.

## Decisions
- Copy in English like the rest of the site. Title "Garage to AGI: Idle AI Tycoon".
- Not on Google Play production yet (closed testing, events start 2026-10-30): status reads "Coming soon to Google
  Play", iPhone to follow. No store link until the listing is live.
- Page is not added to the header or footer (owner asked for a shareable URL only); it is in the sitemap.
- Small pixel font Jersey 10 (the game's title font), self-hosted in `public/fonts/` and preloaded by this page only.
  `next/font` was tried first and rejected: in this static export it preloaded the font on every page, home included.
- The newsletter section from the home page closes the page ("One email when something ships").
- Page-specific share card: `pageMetadata` gets an optional `image`; the game icon is the card.

## Phases
1. [x] Assets: pixel art and icon into `public/assets/idle-ai-tycoon/` (kebab-case names).
2. [x] Content file `src/content/idle-ai-tycoon.ts`, components in `src/components/idle-ai-tycoon/`, CSS module.
3. [x] Route `src/app/idle-ai-tycoon/page.tsx`, `routes.ts`, `pageMetadata({ image })`, sitemap.
4. [x] Tests in `tests/site.spec.ts`: heading, metadata, no sideways scroll, no ads/purchase words (text and alt texts).
5. [x] Docs: README pages list, codebase summary, design guidelines (assets, font, page rules), overview.
6. [x] Verify: lint, typecheck, build, 70 Playwright tests (desktop and Pixel 7), screenshots at 1440, 1024, 768 and 390 px.
7. [x] Independent review by a code-reviewer agent (fact-check of 55 claims against the game's docs, policy, code):
   `plans/reports/code-reviewer-261012-1957-idle-ai-tycoon-page-review.md`. No critical issue. Fixed in the follow-up:
   - H1 the Simulation and products copy implied new model families and products on every layer (they repeat after
     Layer 16; new families are a content drop): now "x10 revenue, a new palette and glitches" and "Hyperscale, Orbital and
     Dyson each bring ten new ones".
   - H2 "free boost" (the game's paid x2 boost word) became "a free +2 BENCH"; M1 node failure now says cash, not "pay now".
   - M2 "iPhone version to follow" removed (status is only "Coming soon to Google Play"); M3 Exit and Era Shift are two steps.
   - M4 the banned-words test now scans text, alt texts, aria labels, image names and metadata, the game's paid-feature
     words and the unreleased features, with guards against checking nothing.
   - L1 mind titles use the game's wording, L2 OVERFIT cost, L3 specialists/outfits/Tet decor wording; a11y (loss-spike
     picture has a text equivalent, hidden minds announced as "Not found yet", brighter "???"), HUD icon at 2x, products
     grid 5 or 2 columns, kicker breaks only after a "·", 256px hero icon, all copy moved into the content file, typed
     rarity map, dead values removed, docs corrected.
   - Left to the owner: the "pity counter" wording (gacha jargon, but it is in the store listing) and the studio newsletter
     on the game page.

## Acceptance criteria
- Page renders at `/idle-ai-tycoon/` with one `h1` "Garage to AGI", no console errors, no sideways scroll at 320–390 px.
- Copy never mentions ads, purchases, subscriptions or upgrades, and no feature that is not in the app.
- Pixel art stays crisp (`image-rendering: pixelated`), reduced motion respected, images have alt text where informative.
- `npm run lint`, `npm run typecheck` and `npm test` pass; sitemap lists the page.

## Open questions
- Link to the Google Play listing (and the App Store later) once live.
- Whether to link the page from the Products page or footer.
