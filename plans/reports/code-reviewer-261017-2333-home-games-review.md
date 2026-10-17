# Code review: 1010! and Garage to AGI on the home page

Date: 2026-10-17 23:33 (Asia/Singapore) · Plan: `plans/261017-2316-home-games-1010-garage-to-agi/plan.md`

## Outcome

The change is ready to ship. I found no critical, high or regression defects. Existing cards and store buttons render
exactly as before, the 1010! buttons are fully reachable above the tilted phone, and no copy rule is broken. What is
left: two docs claims that overstate the code, a plan file whose checkboxes were never ticked, and small optional
hardening.

## Scope

- Reviewed: the full `git diff` (21 files), the new `src/components/store-button.tsx` and `store-button.module.css`, both
  new PNGs, and the plan. I ignored `.claude/launch.json`.
- Live checks: I served the fresh `out/` build (23:33) on a temporary port and ran my own Playwright probes at 1440, 1024,
  870, 860, 390, 360 and 320 px. They measured layout, hit-testing, hover, tab order and computed styles. The server has
  since been stopped. I did not re-run lint, typecheck or the 117 tests; the caller had already run them.
- I modified no source files and no plan file, as instructed.

## Verified, no action needed

- **`a.card:hover`.** `.card` is used only by the teaser cards. Specificity goes from (0,2,0) to (0,2,1), and no other
  rule competes. When hovered, the Duoly, Kim Tài and Garage cards still move up 3 px and turn `#24242C`: the
  `!important` still beats the filled `dt-reveal-50` animation. The 1010! div stays put.
- **StoreButton move.** The CSS moved over word for word. Computed height, min-width, colours, radius, padding and both
  fonts are identical for all four buttons on `/products/` and for the one on `/idle-ai-tycoon/`. No leftover rule in
  `products.module.css` targets the old class.
- **1010! store buttons above the phone.** I hit-tested the centre and corners of each button at every width above, and
  each hit lands on the button, never on the phone. At the bottom-right 2 px corner the probe falls through to the
  container because of the 7 px border radius. The `/products/` buttons do the same, so this is not a stacking problem.
  Tab order is logical: Duoly, Kim Tài, Google Play (1010!), App Store (1010!), Garage to AGI.
- **Markup.** No link sits inside another link. The 1010! card is a `div`, and an `h3` inside an `a` is valid. The
  Garage scene has `width`/`height`, so loading it causes no layout shift.
- **Layout claims in the docs.** At 870 px the grid shows two columns, at 860 px one. It never reaches three, because
  `--page-max` is 1240 px. A marquee group measures 4,419 px, which at 100 s is about 44.2 px/s. No width has sideways
  overflow. The accent hex values in the docs match the CSS.
- **Copy rules.** The Garage card, its llms.txt line and the JSON-LD contain no banned words and no unreleased feature.
  None of them promise an iPhone release. "Coming soon" no longer appears anywhere in `src/`, `tests/`, `docs/`, README
  or the share-image template. No visible copy says how many apps there are.
- **Structured data.** `VideoGame` is a subtype of `SoftwareApplication`, so `installUrl` is valid on it, and there is
  no `offers` field. `productsGraph()` lists its apps one by one, so `apps.blockPuzzle` does not end up in the products
  page markup.

## Medium

1. **A docs claim overstates where the card's copy lives.** `docs/codebase-summary.md` says `idle-ai-tycoon.ts` holds
   "every word of the game page and its home card". In fact the card's eyebrow (`"04 · Idle AI tycoon"`), tags
   (`ANDROID`, `PIXEL ART`, `IDLE TYCOON`) and scene alt (`"Garage to AGI — the pixel-art garage lab"`) are written
   directly in `src/components/home/products-teaser.tsx`. The rules are still enforced, because the site test scans the
   rendered card. Two possible fixes:
   - Move those strings into `game`, for example `game.card = { eyebrow, tags, sceneAlt }`, so the content file's
     header rules cover them.
   - Or change the docs to say the card takes its name, pitch and art from `idle-ai-tycoon.ts`.

## Low

2. **A date claim the plan does not support.** `docs/design-guidelines.md` says "public listing since 2026-10-15", but
   the plan only records that the listing was *updated* on 2026-10-15. Either confirm the date or write "out on Google
   Play (October 2026)" to match `project-overview-pdr.md`.
3. **The plan file is stale.** Its status is still "in progress" and all six phase boxes are unticked, although the
   diff and the caller's checks cover every phase. Tick them and set the status once this is committed.
4. **One new field is untested.** `tests/structured-data.unit.spec.ts` checks `sameAs` but not `installUrl`. One line,
   `expect(game.installUrl).toBe(GAME_LISTING)`, would cover it.
5. **One margin depends on rule order.** `.gameWindow + .learnMore { margin-top: 6px }` and
   `.appCard .learnMore { margin-top: auto }` have the same specificity. The first wins only because it comes later in
   `home.module.css`, so moving it above the second would quietly bring back `auto`. It is correct today; it just needs
   to stay where it is.
6. **The Garage card grows on tablets (owner's call).** From about 600 to 869 px the grid has one column and the scene
   stretches to full width, so the Garage card reaches about 650 px (at 860 px) against 520 px for the others.
   Capping `.gameWindow`'s width (for example `max-width: 480px`) would keep the cards closer in height. This is
   cosmetic.
7. **Already the existing design, not a regression.** Below about 430 px the tilted phone covers the end of the 1010!
   description and its "iOS"/"NO TIMER" tags. The Duoly and Kim Tài cards behave the same way.
8. **Already the existing pattern (accessibility).** The store buttons' accessible names ("GET IT ON Google Play") do
   not name the app. The card heading gives that context, which meets WCAG 2.4.4 (link purpose in context), and the
   products page uses the same pattern. An optional visually hidden "1010! Block Puzzle on" would help people who browse
   by link list.

## Recommended actions

1. Fix item 1: either move the card's eyebrow, tags and alt into `game`, or reword the docs line.
2. Confirm or soften the release date in `design-guidelines.md` (item 2).
3. Tick the plan's phases after the commit (item 3).
4. Optional: the `installUrl` assertion (item 4) and the `.gameWindow` width cap (item 6).

## Metrics

- Type coverage: strict TypeScript with no `any` added. `ACCENT_CLASSES` is now `Record<Accent, …>`.
- Tests: the caller reports 117/117 passing on desktop and Pixel 7. I did not re-run them.
- Lint: the caller reports 0 issues.

## Unresolved questions

- Has the Garage to AGI listing been public since 2026-10-15, or was it only updated that day?

Status: DONE
Summary: No critical, high or regression defects. Existing cards and store buttons are unchanged, the 1010! buttons are fully reachable above the phone, and the copy rules hold. One docs claim about where the card's copy lives overstates the code.
Concerns/Blockers: Small docs fixes (codebase-summary wording, the release date) and the stale plan checkboxes.
