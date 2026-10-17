# 1010 and Garage to AGI on the home page

Status: done · Created 2026-10-17

## Outcome
The home page presents the two games next to the apps: a card for each in "Different apps, one standard." (a 2×2 grid
with Duoly in Love and Kim Tài) and an item for each in the product marquee. Garage to AGI is out on Google Play, so its
page stops saying "Coming soon" and links the listing.

## Decisions (owner, 2026-10-17)
- Big cards plus marquee items, not the marquee alone.
- The site has no 1010 page: its card carries Google Play and App Store buttons instead of a link.
- Garage to AGI's card opens `/idle-ai-tycoon/`; the game page gets the Google Play button and a "live" status.

## Facts used
- 1010 is "Block Puzzle Original" (in-game wordmark "1010!"), private repo `dantech0xff/1010-puzzle` (Unity), bundle
  `com.creative.bbpuzzle` on Google Play and App Store id 1268716035. Its icon is the repo's
  `Assets/Block Puzzle/Images/1010-app-icon-512x512.png` (same as the App Store icon), halved.
- Its card screen is the in-phone screen of the owner's Google Play screenshot "10×10. NO TIMER." (1080×1920): the
  screenshot's status bar painted over (the mockup draws its own), cut above the pieces in the trays, the empty trays
  extended down to the mockup's aspect, 428×954.
- Garage to AGI (`com.dantech.idle_ai_lab`) has a public Google Play listing (seen 2026-10-17, last updated 2026-10-15). Its card keeps the
  game's copy rules and uses its pixel art, not store screenshots.

## Phases
1. [x] Store links, shared `StoreButton`, 1010 in the app content, the game's status.
2. [x] Home: marquee items (speed kept near 44 px/s) and the two cards.
3. [x] Game page: Google Play button; structured data and llms.txt follow.
4. [x] Tests: home cards and links, the game card's copy rules, the game page's store link.
5. [x] Docs: README, design guidelines, code summary.
6. [x] Verify: lint, typecheck, build, Playwright; visual check at 1440, 1024, 390 and 320 px.

## Acceptance criteria
- Both games show on the home page at every width with no sideways scroll; the existing cards keep their look.
- 1010's buttons open its two store listings; the Garage to AGI card opens its page.
- Nothing the site says about Garage to AGI mentions ads, purchases or upgrades, nor an iPhone release.
- Lint, typecheck, build and the full Playwright suite pass.

## Review
Report: `plans/reports/code-reviewer-261017-2333-home-games-review.md` (no critical, high or regression finding). Applied:
the Garage to AGI card's words moved into `game.card`, the release date in the docs is "October 2026", `installUrl` is
asserted, the card's "Learn more" rule no longer depends on file order, and the scene window is capped at 482px so a
one-column tablet card stays near the others' height.

## Open questions
- Since when has the Garage to AGI listing been public? The site says only "October 2026".
