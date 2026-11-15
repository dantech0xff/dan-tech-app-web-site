# Code review: Garage to AGI page refresh (`/idle-ai-tycoon/`)

Date: 2026-11-15 (Asia/Singapore) · Reviewer: code-reviewer · Mode: read-only (no source edited)

## Code Review Summary

### Scope
- Files reviewed: `src/content/idle-ai-tycoon.ts`, `src/components/idle-ai-tycoon/{game-hero,moments-section,gameplay-video,install-bar,google-play-qr,screens-section,faq-section,download-section}.tsx`, `game.module.css`, `src/lib/qr-code.ts`, `src/lib/structured-data.ts`, `src/app/idle-ai-tycoon/page.tsx`, `tests/site.spec.ts`, `tests/qr-code.unit.spec.ts`, `tests/copy-rules.ts`, README and the three docs; the new screens, poster and loop (inspected frame by frame); `src/app/privacy/page.tsx` for consistency.
- Lines analyzed: about 690 changed lines plus 550 new lines.
- Review focus: the uncommitted changes (`git diff` and untracked files, `.claude/` ignored).
- Updated plans: none. This was a read-only review. Item 7 of `plans/261115-1919-garage-to-agi-page-refresh/plan.md` stays open, and one of its acceptance criteria fails (H1).

### Overall Assessment
The work is solid. The QR encoder matches the reference algorithm and decodes. The video crop hides the chip counter and the SHOP tab in every sampled frame. Lint, typecheck and build are clean, and the full Playwright suite passes (132 tests). Three problems should be fixed before shipping:
- The install bar's state goes stale after any scroll jump that skips the observed elements, so it can sit over the newsletter and footer.
- The new FAQ answer "Only weekend events go online" contradicts the site's own privacy policy.
- "Code Copilot" is still on the page, although the game's compliance checklist took it out of store copy.

There are also several medium copy, accessibility and responsive issues.

### Critical Issues
None.

### High Priority Findings

**H1. The install bar's state goes stale after a scroll jump, and the bar can cover the newsletter and footer.** (`src/components/idle-ai-tycoon/install-bar.tsx:24-31`)
- **Cause.** The observer only fires when the hero button row or `#download` crosses the viewport. A jump that carries `#download` from below the viewport to above it (or back) without it ever intersecting fires nothing. The same happens to the hero row, so the old booleans stay.
- **Reproduced** in Chromium at 1280x720 and at 390x844:
  - From `#worlds`, a single `mouse.wheel(0, 4000)` or `scrollTo(bottom)` lands at the footer with `data-visible="true"`. The bar sits over the newsletter and footer.
  - The reverse also fails. After a reload below `#download`, a jump back to `#events`/`#faq` keeps the bar hidden mid-page.
  - Real triggers: dragging the scrollbar (1 px of thumb is about 18 px of this 12,800 px page), wheel scrolling with smooth scrolling off (Windows, Linux, some reduced-motion setups), and instant programmatic jumps.
  - Hash loads (`#faq`, `#download`, `#events`, `#collect`), reload restoration and resize all came out correct.
- **Plan impact.** This breaks the acceptance criterion "never covers the closing section, the newsletter or the footer".
- **Fix.** Derive the state from live geometry on every scroll frame (two rect reads per frame), instead of from per-entry flags:
  ```ts
  const update = () =>
    setVisible(hero.getBoundingClientRect().bottom <= 0 && closing.getBoundingClientRect().top >= window.innerHeight);
  let frame = 0;
  const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
  return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  ```
  An alternative is to keep the IntersectionObserver, observe every `main > section` plus the footer, and run the same `update()` in its callback. Any jump changes which section is in view.
- **Test to add** (`tests/site.spec.ts`, in the install bar test): from `#worlds`, `window.scrollTo(0, document.documentElement.scrollHeight)` and expect `false`; then `#collect.scrollIntoView()` and expect `true`.

**H2. The FAQ claim "Only weekend events go online" contradicts the privacy policy.** (`src/content/idle-ai-tycoon.ts:491`)
- **Conflict.** The site's privacy page (`src/app/privacy/page.tsx:65-90`) says the game sends data to AdMob, Firebase Analytics, Crashlytics, Remote Config and RevenueCat. It also says new game content downloads from Firebase Hosting. A public statement that only events go online is a misleading privacy claim that a user or a Play review could hold against the studio.
- **Fix.** Describe what needs a connection, not what traffic exists. Proposed text: "No account and no sign-up: the game starts at once, plays without a connection and keeps your save on your device. Weekend events are the one part that needs to be online; they use an anonymous ID and can be switched off in the settings." It mentions no ads and claims no exclusivity.

**H3. "Code Copilot" is still on the page.** (`src/content/idle-ai-tycoon.ts:197`, Garage products grid)
- **Conflict.** The game's `docs/store/compliance-checklist.md:260` says "Copilot" is a Microsoft and GitHub product name, and that the store copy has not named it since 6 Oct 2026. The design-guidelines text added in this change says shots that name it are left out, yet the page prints it as text.
- **Scope.** The line is older than this change, but it now contradicts both the facts and the new docs.
- **Fix.** This needs an owner decision. The "use the game's own wording" rule and the trademark rule pull in opposite directions. Options: rename it on the page only, or drop the grid's per-product names. Afterwards add `copilot` to `BANNED` in `tests/copy-rules.ts`.

### Medium Priority Improvements

**M1. "adds a free +2 BENCH"** (`src/content/idle-ai-tycoon.ts:326`)
- The plan's constraints ban "free". The design guidelines say an emergent ability "adds +2 BENCH".
- The test misses it because `BANNED` only matches `free-to-play`.
- Fix: write "an emergent ability adds +2 BENCH" and add `free` to `BANNED`. No other "free" is in the game copy.

**M2. The Hall of Minds screenshot shows counts that grow with content.** (`screen-hall-of-minds.webp`, `idle-ai-tycoon.ts:559-562`)
- The image shows "4/19", the milestone ladder up to "19 … Loop Breaker" and "TROPHIES 12". These are exactly the mind and achievement counts the owner keeps off the page.
- Tests do not scan pixels, and the shot goes stale when minds are added.
- Fix: re-crop below the header and progress strip (start at the trophies row), pick another capture, or get the owner's explicit OK.

**M3. The install bar cuts the game's name on common Android widths.** (`game.module.css:1143-1156`)
- `.installName` is `nowrap` with no overflow handling. The name's text runs behind the store button:
  - 57 px at 320 px wide, where only "GARAGE" shows.
  - 37 px at 340 px.
  - 17 px at 360 px, the most common Android width.
  - 2 px at 375 px.
- The mobile tests run on a Pixel 7 (412 px), so nothing catches it.
- Fix: inside the existing `max-width: 399px` block, use about 19 px type, or allow wrapping with `line-height: 0.9`, or hide `.installIcon` below 360 px. Add a fit check at 360 px.

**M4. The looping video has no pause control (WCAG 2.2.2, Level A).** (`gameplay-video.tsx`)
- The loop starts automatically, lasts more than 5 s and loops forever. Honouring reduced motion and Save-Data does not count as the pause mechanism.
- Fix: add a small pause/play toggle over the phone. The component is already a client component.
- Also listen for `matchMedia(...).addEventListener("change", …)`, so a reduced-motion change made while the page is open is honoured.

**M5. The fixed bar can hide the focused element (WCAG 2.4.11).**
- Measured at 1280x720: tabbing to the next FAQ summary placed it at y 656-720, under the bar at y 638-708. On phones the bar is 366 of 390 px wide, so a focused control at the bottom edge can be fully hidden.
- Fix: add `scroll-padding-bottom: 96px` while the bar is visible, for example `html:has(aside[data-visible="true"]) { scroll-padding-bottom: 96px; }` in the module (`:global(html)`), or set it on the page.

**M6. Safari may never play the loop.**
- The production host ignored `Range` requests on two cached assets. Both `/assets/share/site.jpg` and `/fonts/jersey-10.woff2` came back `200` with the full body, no `206` and no `Content-Range`, on `cf-cache-status: HIT`.
- Safari on iOS and macOS needs byte-range responses for MP4, so it would show only the poster. That degrades gracefully, but the feature is gone there.
- Verify after deploy with `curl -sD - -o /dev/null -H 'Range: bytes=0-1' https://dantech.app/assets/idle-ai-tycoon/gameplay-loop.mp4` and a real Safari check.
- If ranges are missing, either accept poster-only Safari or serve the file through something that answers ranges (R2 behind the Worker).

**M7. The research card says "for the rest of the run".** (`idle-ai-tycoon.ts:347`)
- Everywhere else on this page "run" means a training run (loss spike, node failure, "every tap takes a second off the run").
- Research actually lasts until the Exit and the era shift. The game's `lib/data/meta_data.dart:74-76` says "lost on Exit and on Era Shift".
- Fix: "…each raising BENCH or compute until you sell the company or move to a new world."
- The technique names (Better Tokenizer, Flash Attention, RLHF, Mixture of Experts) and the opening at Series B check out against the game's `kResearch` and `kRoundUnlocks`.

### Low Priority Suggestions
- **L1. Hero overlap** (`game.module.css:239,254`). At 1024 and 1440 px the rotated phone touches the GARAGE ERA chip and clips the first glyph of "70B PARAMS". The phone's right edge is at 735 and 987 px; the chip and HUD start at 734 and 985 px. The 17% inset ignores the -3deg tilt. Use about 20%.
- **L2. The screens list** (`screens-section.tsx:12`, `game.module.css:914`):
  - `tabIndex={0}` gives an empty tab stop at 1000 px and wider, where the grid does not scroll.
  - On phones the list runs edge to edge and `.section { overflow-x: clip }` cuts the sides of its focus ring.
  - `aria-label="Screens from the game"` is copy outside the content file, against the "all copy in `idle-ai-tycoon.ts`" rule.
  - Add `role="list"`, because Safari drops list semantics under `list-style: none`.
- **L3. FAQ markers** (`game.module.css:1050,1057`). The `+`/`-` generated content becomes part of each summary's accessible name. Use `content: "+" / ""` and `content: "-" / ""`.
- **L4. Prefixed backdrop filter** (`game.module.css:1124`). `-webkit-backdrop-filter` is written by hand, against design rule 3. The compiled output is fine today, but drop the line.
- **L5. QR module size** (`game.module.css:983`). 104 px over 45 modules is 2.31 px per module, and `crispEdges` makes the modules uneven on 1x screens. Use 90 px or 135 px (2 or 3 px per module).
- **L6. Thin tests.**
  - The install bar test only walks section by section (see H1).
  - The video test covers only the reduced-motion path. Stub `HTMLMediaElement.prototype.play/pause` to assert play on screen, pause off screen, and nothing with Save-Data.
  - The QR decode is skipped on Linux, because `BarcodeDetector` is missing there. Add a known-answer fixture of the listing's 37 rows so every platform pins the data and the RS codewords.
  - The JSON-LD `screenshot` field is asserted nowhere (absolute URLs that are served).
  - `BANNED` lacks `free` and `copilot`.
- **L7. Docs.**
  - `docs/codebase-summary.md:13` calls `install-bar.tsx` "the page's only client component", but `gameplay-video.tsx` is one too.
  - README's section list leaves out `#screens`.
- **L8. Local server MIME type.** `scripts/serve-static.mjs` has no `.mp4` entry, so the preview serves the loop as `application/octet-stream`. Add `".mp4": "video/mp4"`.
- **L9. Events lead (older line).** "plus seasonal specials" (`idle-ai-tycoon.ts:143`) suggests extra events, but the seasonal events replace that week's event.
- **L10. Video download timing.** On phones the hero is in view at load, so the 1.7 MB loop starts downloading at first paint, competing with the hero's other resources. Consider calling `play()` only after `load`.

### Positive Observations
- **QR encoder** (`qr-code.ts`). I checked it line by line against the reference algorithm:
  - The level M EC and block table for v1-6 (all blocks equal) and the alignment centres.
  - Timing and finder patterns with separators, the dark module, and the format BCH with 0x537 and the 0x5412 mask, both copies.
  - The eight mask formulas, zig-zag placement with remainder bits left light and masked, and the RS divisor and remainder.
  - The decode with `BarcodeDetector` ran and passed on this Mac.
  - It is encoded at build time and ships no script.
- **Video.**
  - `muted=""` and `playsinline` are in the static HTML, and the source uses `preload="none"`.
  - Pause off screen and resume on return were verified.
  - The rendered video box equals the screen box (234x326 at 1440), so the crop holds. None of 15 sampled frames shows the top bar or the tab bar.
  - The poster matches the loop's first frame.
- **Install bar.** It ships `aria-hidden="true" inert=""` in the static HTML, so it never flashes or announces before hydration.
- **Copy.** The new copy matches the confirmed facts: train tap, launch ceremony with MATH/CODE/JOKES/VIBES/CAT PICS, The Climb, the opening-story line, x10 per layer from Layer 3, glitch stacking, Hackathon Weekend variants, Android 7.0+, and 8 h away.
- **Responsive.** There is no sideways scroll from 320 to 390 px.

### Recommended Actions
1. Fix H1 and add the jump test.
2. Reword the H2 FAQ answer.
3. Get the owner's decision on H3 and M2.
4. Fix M1 and add `free` and `copilot` to `BANNED`.
5. Fix M3 (and add a 360 px check), M5 and M7.
6. Add the M4 pause toggle.
7. After deploy, run the M6 range check on the MP4.
8. Do the L items when convenient.

### Metrics
- Type coverage: strict TS, `tsc --noEmit` has 0 errors.
- Test coverage: no coverage tool. Playwright: 132 passed (desktop and mobile).
- Linting issues: 0.

### Unresolved Questions
1. Code Copilot: rename it on the page, or keep the in-game name? (Owner decision; H3.)
2. The loop and the LAB, Layer 9 and Hall shots show in-game "BUY x1" and "BUY DATA" buttons with cash prices, plus the Hall's "STYLE" button. Is that within the plan's "no price word"? They are in-game cash, but `BANNED` bans "buy" in text.
3. Is the Hall of Minds shot with "4/19" acceptable (M2)?
4. Does production answer byte-range requests for the MP4 (M6)?
5. Outside this diff: the privacy page lists "a weekly board" among the online features (`privacy/page.tsx:86`), while the game page treats the weekly deepest-layer board as not live. Which one is right?

Status: DONE_WITH_CONCERNS
Summary: The page builds, lints, typechecks and passes 132 tests, and the QR encoder and video crop are correct. The install bar goes stale after scroll jumps (it can cover the newsletter and footer), the FAQ's "only weekend events go online" contradicts the privacy page, and "Code Copilot" is still on the page.
Concerns/Blockers: H3, M2 and the BUY-button question need owner decisions; Safari playback (M6) can only be confirmed after deploy.
