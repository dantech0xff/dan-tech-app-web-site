# Share images (1200x630) for the site and the game

Status: done · Created 2026-10-12

## Outcome
Link previews of dantech.app show a proper wide card: one for the studio (every page without its own) and one for the
game (`/idle-ai-tycoon/`), instead of the 512px square mark and the small Twitter card.

## Decisions
- Cards are HTML templates rendered with the project's Playwright Chromium (`npm run share-images`), so they use the
  site's real fonts, the real art and exact pixel scaling. The PNG/JPEG outputs are committed: the Docker build has no
  browser, so they are not made at build time.
- Studio card: the home hero tightened (lockup, headline, subtitle, the two apps on tilted phones, the Duoly icon). A
  JPEG at quality 90 (115 KB): gradients and screenshots, and the PNG was 306 KB.
- Game card: the owner's own feature-graphic idea from the game repo (navy, the title in Jersey 10, the garage scene along
  the bottom, the app icon). A PNG (156 KB) so the pixel art stays sharp. It says only the name and genre, no status.
- `pageMetadata()` defaults to the studio card and sets `twitter:card` to `summary_large_image` with `twitter:image`.
- The preview server (`scripts/serve-static.mjs`) now knows `.jpg`, as nginx does; a test caught it.

## Phases
1. [x] Templates and `scripts/make-share-images.mjs`; render and check at 1200, 600 and 300px wide.
2. [x] Wire the cards into `pageMetadata()`, the game content and the game's structured data (square icon plus card).
3. [x] Tests: Twitter large card and image tags on every page; every card is 1200x630, a PNG or JPEG and at most 300 KB.
4. [x] Docs: README (scripts, SEO), code summary, design guidelines.
5. [x] Verify: lint, typecheck, build, 104 tests.

## Open questions
- Re-render the cards when the home hero or the game's art changes (the README says how).
