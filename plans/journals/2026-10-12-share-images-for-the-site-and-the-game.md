---
title: Share images for the site and the game
date: 2026-10-12
summary: Two 1200x630 share cards rendered from HTML templates with Playwright and wired into the Open Graph and Twitter tags; a test also caught a missing JPEG type in the preview server.
---

# Share images for the site and the game

## What happened

- The owner asked for 1200x630 share images for the site and the game; until then every page shared a 512 px square mark and the small Twitter card.
- The cards are HTML templates in `scripts/share-images/`, rendered by `scripts/make-share-images.mjs` (`npm run share-images`) with the project's Playwright Chromium, so they use the site's real fonts, the real art and whole-number pixel scaling. The outputs are committed because the Docker build has no browser. The studio card is the home hero tightened for a card; the game card follows the feature-graphic idea already written in the game repo (the title in Jersey 10 over the garage scene, with the app icon) and says only the name and genre, so it never needs a status or release line.
- The studio card is a quality-90 JPEG (115 KB): as a PNG it was 306 KB, just over the 300 KB some apps such as WhatsApp ask for. The game card stays a PNG (156 KB) so the pixel art is not softened.
- `pageMetadata()` now defaults to the studio card, sets the Twitter card to `summary_large_image` and adds `twitter:image`; the game page passes its own card, and the game's structured data lists the square icon and the card as its images.
- A new test decodes every page's card in the browser and checks it is 1200x630, a PNG or JPEG and at most 300 KB. It failed first, because the local preview server (`scripts/serve-static.mjs`) had no type for `.jpg` and answered `application/octet-stream`, where nginx answers `image/jpeg`. The server now knows `.jpg`.
- The machine was heavily loaded by other programs (load average above 170), so test runs took anywhere from 15 s to 1.4 min; all 104 tests passed every time.

## Decision

- Render the cards at design time and commit them, instead of generating them in the Docker build.
- Keep the text of the game card free of status, price and ads wording.

## Next steps

- Re-run `npm run share-images` and commit the cards when the home hero or the game's art changes.
- After a deploy, platforms keep an old preview for a while: use each platform's share debugger (Facebook, LinkedIn, X) to refresh it.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
