# Garage to AGI page refresh (`/idle-ai-tycoon/`)

Status: done, live on dantech.app since 2026-11-15 · Created 2026-11-15

## Outcome
The game page sells the game better: real screens of the game, more of what it offers, and a way to install it
from every part of the page, desktop included.

## Constraints
- The owner's copy rules stay (docs/design-guidelines.md, Garage to AGI page): no ads, purchases, subscriptions,
  premium currency, upgrades, "free", the game's paid-feature words; only features live in production; stable
  counts only. Screens and video follow the same rules (no price word, no AD button, no SHOP, no offers' doors).
- Google Play only, no iPhone promise. No ratings, download counts or offers in copy or structured data.
- English copy, the site's tokens plus the game's palette, pixel art with hard edges.

## Non-goals
Header/footer/Products links to the page, a new share card, the store listing itself, analytics.

## Work
1. [x] Install paths: Google Play QR code for desktop (hero and closing CTA), a closing "download" section, an
   install bar that follows the visitor between the hero and the closing section.
2. [x] At-a-glance facts under the hero (stable counts only).
3. [x] Game FAQ section (devices, account and connection, idle time, the ending, who makes it).
4. [x] Real screens: phone frame in the hero (gameplay loop video with poster) and a screenshot gallery.
   Assets requested from the game's session (2026-11-15) into `../dantech-site-incoming/garage-to-agi/`.
5. [x] Features live since 2026-10-12 that the page lacks, once the game's session confirms them.
6. [x] Structured data: `screenshot` on the VideoGame.
   Delivered by the game's session the same day: 33 clean captures of 1.2.2 (ads and purchases switched off), a
   14.7 s silent loop, sprites and a fact check. Used: eight screens cropped free of the chip counter and the SHOP tab
   and without "Code Copilot", the loop (MP4 only), the trophy and brain sprites.
   Corrected from the fact check: The Climb replaces The Daily Token, x10 a layer only from Layer 3, glitches stack,
   seasonal events are Hackathon Weekend variants, Android 7.0+, offline play with a local save.
   Added: train tap, the launch ceremony, Research, the opening story's line in the hero lead.
7. [x] Tests (copy rules over the new sections, every store link, install bar), docs, build, review.
   Review: `plans/reports/code-reviewer-261115-1953-garage-to-agi-page-refresh.md`. Fixed: the install bar now reads
   positions on scroll and resize (an observer missed jumps), the FAQ no longer says only events go online (the
   privacy page lists more), no "free" (now banned by the test), the Hall of Minds shot swapped for the Dyson Era, a
   pause button on the loop, scroll padding under the bar, narrow-phone bar, research wording, seasonal events
   wording, QR at 2 and 3 px a module, FAQ signs silent for screen readers, `role="list"`, MP4 type in the preview
   server. 136 Playwright tests pass.
   Left to the owner: "Code Copilot" in the products grid; whether the in-game "BUY x1" buttons (game cash) may show.
   After deploy: production answered a range request for the MP4 with 200 and the whole file (a documented limit of
   Workers static assets), so Safari would only show the poster. Fixed with a Worker script that runs for `*.mp4` only
   and returns 206 (`worker/`), checked with `wrangler dev` before the push.

## Acceptance criteria
- Every store link on the page opens the game's Google Play listing in a new tab; the copy-rule test covers
  every new section, image and label.
- Desktop shows a scannable QR code of the listing; mobile shows none.
- The install bar never covers the closing section, the newsletter or the footer, and is hidden from assistive
  tech while off screen.
- lint, typecheck, build and the full Playwright suite pass; no sideways scroll at 390 px.
