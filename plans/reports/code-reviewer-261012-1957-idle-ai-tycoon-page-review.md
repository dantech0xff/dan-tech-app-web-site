# Code review: Garage to AGI page (`/idle-ai-tycoon/`)

Date 2026-10-12 · Plan `plans/261012-1957-idle-ai-tycoon-page/plan.md` (phase 7) · Reviewed state: HEAD `779c4ca` (clean tree)

## Outcome

No critical issues and no banned word in anything the page ships. Two High copy problems need a fix before the page is shared:
the Simulation copy implies content drops (rule 2), and "free boost" is wrong and uses the game's paid-boost word.
Four Medium items: the iPhone promise, "pay now", Exit and Era Shift merged into one step, and blind spots in the
banned-words test (it did not catch "boost"). The rest are Low code, a11y, perf and docs nits. The code itself is clean:
server components, one CSS module, no new dependencies, `preload()` works, `pageMetadata({ image })` is backward
compatible, and lint is clean on HEAD (I ran it).

## Scope

- Files: `src/content/idle-ai-tycoon.ts`, `src/components/idle-ai-tycoon/*` (8 tsx + `game.module.css`),
  `src/app/idle-ai-tycoon/page.tsx`, `src/lib/{metadata,routes}.ts`, `tests/site.spec.ts` (group and PAGES),
  README, `docs/{codebase-summary,design-guidelines,project-overview-pdr}.md`, `nginx.conf`, 53 assets, the font,
  and the export (`out/idle-ai-tycoon/*`, the shared CSS bundle). About 1,900 lines.
- Evidence: scratchpad `src-docs/` (store-listing.md = SL, other/CLAUDE.md = CL, text/*.txt boards, Main.txt prototype).
- The tree changed during the review (commit `779c4ca` at 20:35), so I re-read everything at HEAD. That commit already
  fixed three things: the AGI moment no longer says the street goes dark in every era, the GPU Shortage "racks are sold
  out" line is gone, and the unused `icon-trophy.png` and `scene-moving-truck.png` are deleted.
- Live checks: the preview server on :4311 went down mid-review and I did not restart it. I checked 320 px against the
  pre-commit CSS (the rules that changed are single-column at that width) and 900 px against the committed CSS. At
  320 px nothing in the game sections overflows or is clipped.
- Updated plans: none (review only). Phase 7 is for the implementer to tick after the follow-up commits.

## Critical

None.

## High

**H1. The Simulation copy promises new families and products on every layer (rule 2: content drops)**
- `src/content/idle-ai-tycoon.ts:165`: "Every layer brings a new model family, ten new products, a new palette and glitches…".
  Also `gameplay-section.tsx:28` ("Ten new ones in every world after it.") and the comment at `idle-ai-tycoon.ts:82`.
- Evidence:
  - Layers.txt:144: "After 15 families the stack repeats with a mark (PIXEL II, VOXEL II), down to QUARK VII on Layer 100".
  - Layers.txt:6: "Nothing repeats until Loop II".
  - Progress.txt:106: "loops reuse the 15 families … Ship new families as LiveOps drops".
  - SL:200 holds back "new model families over time" until a content drop.
  - SL:60, which describes the current build, says only "every layer brings x10 revenue, a new glitch and a new palette".
- Effect: the claim is false from Layer 17 on, which is 84 of the 99 layers. It only becomes true with content drops.
- Fix:
  - Simulation text: "Your garage was the training data, so you go back to it, one layer down. Every layer brings x10
    revenue, a new palette and glitches that bend the rules you already know. Clear Layer 100 to break out."
  - Products title: "Ten products in the Garage Era. Hyperscale, Orbital and Dyson each bring ten new ones."

**H2. "Free boost" is wrong, and "boost" is the game's paid feature**
- `idle-ai-tycoon.ts:208`: "an emergent ability brings a free boost".
- What the game actually gives:
  - CL:1400: "10% Emergent Ability (+2 BENCH when it ships…)".
  - LiveOps.txt:50: "1 run in 10: a free +2 BENCH".
- Why "boost" is a problem: in this game it means the x2 boost from ads and the subscription.
  - Shop.txt: "BOOSTS x2 revenue for 4h WATCH AD".
  - SL:82 (VC Backing): "the x2 boost always on".
- This was the only hit from the wider monetisation scan of the exported HTML and RSC payload.
- Fix: "an emergent ability adds a free +2 BENCH".

## Medium

**M1. "Pay now" reads like paying real money to skip**
- `idle-ai-tycoon.ts:208`: "a node failure asks whether you pay now or wait longer".
- The cost is in-game cash, not money:
  - CL:1405: "`payNodeFailure` (5% of the cash) or `acceptNodeFailure` (+10% run time)".
  - LiveOps.txt:51 says the same.
- Fix: "a node failure asks whether to spend 5% of your cash on a fix or let the run take 10% longer."

**M2. "iPhone version to follow" promises an iOS release**
- `idle-ai-tycoon.ts:22`, shown at `game-hero.tsx:25`.
- Owner rule 4 sets the status to "Coming soon to Google Play" and nothing else.
- SL:3 only says "the ASC copy waits for the iOS release", with no date.
- The plan records "iPhone to follow" under Decisions, not under the owner's rules.
- Fix: drop `statusNote` (its span and the `.statusNote` CSS) unless the owner confirms it. If you drop it, update the
  "two status lines" wording in the README and in design-guidelines.md (Status).

**M3. "Sell, shift, repeat" makes Exit and Era Shift one step**
- `idle-ai-tycoon.ts:76`: "Sell the company for Cred … Then move into a bigger world and start again, faster."
- Selling does not move you to a new world:
  - The prototype's Exit confirm (Main.txt) says "You get +N Cred. Every Cred adds 2% revenue, forever. You stay in this era."
  - Endgame.txt:87–90: Exit keeps the "Same era"; Era Shift comes "After the capstone ships".
  - SL:58–59 keeps them as two separate bullets.
- Fix: "Sell the company for Cred: every Cred adds 2% revenue, forever, and your next startup grows faster. Ship an
  era's eighth model to shift into a bigger world."

**M4. The banned-words test misses several surfaces the owner's rule covers, and missed H2**
- `tests/site.spec.ts:230–241`. What it misses:
  - (a) Metadata is not scanned (title, description, og/twitter text and image alt), although rule 1 includes metadata.
  - (b) Image file names are not scanned.
  - (c) The regex lacks the game's own monetisation words: boost, Founder Pass, VC Backing, Overclock, Board Seat,
    Server Uptime, Starter Pack, currency, gems, price, `$`.
  - (d) Nothing checks for the features that are not in the app yet (weekly board, content drops, titles other players see).
  - (e) The newsletter is excluded by position (`section:not(:last-child)`). A section added after it would be skipped
    without any failure.
  - (f) The alt-text check has no guard against checking nothing.
- Suggested change (it should fail on "boost" until H2 is fixed):

```ts
const sections = page.locator("main > section:not(:has(form))"); // the studio newsletter is the only form
const text = (await sections.allInnerTexts()).join("\n");
const imgs = sections.locator("img");
const alts = (await imgs.evaluateAll((list) => list.map((i) => i.getAttribute("alt") ?? ""))).filter(Boolean);
const files = await imgs.evaluateAll((list) => list.map((i) => i.getAttribute("src") ?? ""));
const meta = await page.evaluate(() => [document.title, ...[...document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')].map((m) => m.getAttribute("content") ?? "")]);
expect(text.length).toBeGreaterThan(4000);
expect(alts.length).toBeGreaterThan(20);
const banned = /\b(ads?|advert\w*|purchas\w*|in-app|iap|subscri\w*|premium|upgrad\w*|paywall|chips?|coins?|gems?|currenc\w*|buy\w*|shop\w*|store|price\w*|boost\w*|overclock|founder pass|vc backing|board seat|server uptime|starter pack|free[- ]to[- ]play)\b|\$\d/i;
const notYet = /weekly (deepest[- ]layer )?board|content drops?|titles? other players/i;
for (const s of [text, alts.join("\n"), files.join("\n"), meta.join("\n")]) {
  expect(s).not.toMatch(banned);
  expect(s).not.toMatch(notYet);
}
```

## Low

**L1. Era cards show mind titles the game does not use** (`idle-ai-tycoon.ts:143`, `:155`)
- The page has "COMET-8 thinks in planets" and "PULSAR-8 finds the truth", set in the pixel font so they look like the
  game's own titles.
- The game builds the title as family + "-8 IS " + mind (Main.txt `mindTitle`), giving "COMET-8 IS A PLANETARY MIND" and
  "PULSAR-8 IS A STELLAR MIND". Endgame.txt:24 and :26 have "BECOMES A PLANETARY / STELLAR MIND".
- "Finds the truth" appears nowhere in the evidence.
- Fix: "COMET-8 becomes a planetary mind" and "PULSAR-8 becomes a stellar mind".

**L2. OVERFIT leaves out its cost** (`idle-ai-tycoon.ts:176`)
- Layers.txt:88 says "+5 BENCH and +25% time". The prototype says "Always: +5 BENCH and +25% time".
- Fix: "…for a sure +5 BENCH, at the cost of 25% more time."

**L3. Three small overreaches**
- `:263` "Each era also brings specialists": the Garage has none (TeamSystem.txt:141). Say "From the Hyperscale Era on…".
- `:222` "A new outfit in every era": the layers reuse the garage outfit (Founder.txt:23–26).
- `:321` "lanterns hung over your HQ": the decor is the last tier's reward (CL:895–897). Say "…and lantern decor for your
  HQ at the top of its track".

**L4. "Odds and your pity counter" is gacha jargon** (`:263`)
- It is accurate (SL:55) and not on the banned list.
- But the store listing ties Job Fair recruits to paid random items (SL:80). The owner should decide whether to keep it
  (see questions).

**L5. Accessibility**
- The loss-spike mock is `aria-hidden` (`moments-section.tsx:10`), but the text beside it (`:185`) leaves out its numbers
  (8%, +3 BENCH, 15%). Add them to that text, or give the stage `role="img"` and an `aria-label`.
- Hidden minds:
  - `collect-section.tsx:46` renders "???", which screen readers read out literally.
  - `game.module.css:749` draws it in `--g-steel` on `--g-ink`, which is 3.1:1 (AA needs 4.5:1).
  - Fix: use `--g-mist` (about 8:1) and add an accessible name such as "Not found yet". The repo has no visually-hidden
    utility, so it needs one.
- The hero scene (`game-hero.tsx:40`) and the Garage Era card (`worlds-section.tsx:34`) use the same long alt, so it is
  read twice. Make the hero image decorative or shorten its alt.
- Optional: lists styled with `list-style: none` lose their list semantics in Safari/VoiceOver. Add `role="list"` if that
  matters.

**L6. Pixel art and layout**
- The HUD sprite is 24px wide, which is 1.5× its size, so its pixels are uneven (`game.module.css:215`,
  `game-hero.tsx:48`). Use 32px.
- `.products` uses 4 columns from 700 to 999 px, which leaves a row of 2 under two rows of 4. I measured this at 900 px.
  Ten items divide evenly by 5 and by 2, so go straight from 5 columns to 2.
- At 320 px the kicker wraps before a "·" ("PIXEL ART / · PORTRAIT"). The products page avoids this by joining each part
  with no-break spaces (`product-parts.tsx:25–30`). Move that helper somewhere shared and use it for `game.kicker` and the
  event labels.

**L7. Duplicate and dead values**
- `game.name` is unused because the h1 hard-codes the name (`idle-ai-tycoon.ts:13`, `game-hero.tsx:17`).
- `hud.value` repeats `hud.percent` (`:30`).
- The CSS width on `.barFill` is overridden by the inline style (`game.module.css:223–224`).
- `--g-night` is unused, while the rarity rules hard-code palette hex values instead of using the variables (`:21`, `:704–707`).
- `styles[hire.rarity.toLowerCase()]` (`collect-section.tsx:20`) is a string lookup. `product-parts.tsx` uses a typed map
  for the same job (`Record<Rarity, string>`).
- `MindProps` (`worlds-section.tsx:6`) repeats the shape of `Era["mind"]`.

**L8. Performance**
- `icon-512.png` is 50 KB of the page's 77 KB of art, but it is shown at no more than 120 CSS px (`game-hero.tsx:36`).
  Add a 256 px copy for the hero and keep the 512 px file for the share card.
- The game's CSS module adds about 14.8 KB (minified, before gzip) to the one stylesheet every page loads. This is
  documented and acceptable for now.
- `font-display: block` can hide the h1 for a moment on slow connections. It is preloaded, so this is fine.

**L9. Tests and docs**
- The preload test (`site.spec.ts:273–278`) should also assert `[as="font"][crossorigin]`. Without `crossorigin` the font
  downloads twice.
- `README.md:59` still says "self-hosted icon font subset".
- `design-guidelines.md:35` says sprites are shown at 3× or 4×. The minds use 2×, and the HUD 1.5× (until L6 is fixed).
- `design-guidelines.md:110`: the rename rules do not match the actual files. I matched them by byte size against
  assets-tree.txt:
  - `s_hq_hyper` → `scene-hyperscale`
  - `brain_sim` → `mind-layer`
  - `t_founder_*` → `crew-founder-*`
  - `s_scene_glitch` → `scene-simulation`
  - `s_agi_street` → `scene-agi-street`
  - `s_event_shortage` → `event-gpu-shortage`
  - `s_event_launch` → `event-launch-week`
- `codebase-summary.md:54` says `idle-ai-tycoon.ts` holds "the whole game page". The section headings and leads are
  hard-coded in the components (for example `gameplay-section.tsx:10–11, 28, 41`). Move them into the content file or
  change the doc, so future copy edits find every line.

## Policy scan (rules 1–4)

- Banned topics: none in the game copy, alt texts, aria attributes, metadata, the 53 asset file names, or the exported
  HTML and RSC payload. The only wider-scan hits were "free boost" (H2) and the studio newsletter's "Subscribe" /
  "Unsubscribe", which the test excludes on purpose (see questions).
- Features not in the app yet: the page never mentions the weekly board, content drops or titles other players see.
  "HQ skins and titles" means the player's own titles (CL:1512–1520). H1 implies content drops.
- Unstable counts: no counts of minds, achievements or specialists. The counts used are the stable ones (10 products,
  8 models, 12 hires, 100 layers), plus fixed rules: four-week rotation, 50-lab brackets, 72 h, seven missions.
- Promises: "Coming soon to Google Play" is the owner's wording, with no store link. "iPhone version to follow" is M2. No dates.
- The test title and the source comments mention "ads, purchases"; none of that reaches the export (checked).
- The Golden hoodie is a reward on the free event track, not the Founder Pass lane (CL:917–918, CL:950–954), so it
  implies no purchase.

## Claim check (src/content/idle-ai-tycoon.ts unless noted)

| # | Claim | Verdict | Source |
|---|---|---|---|
| 1 | Title "Garage to AGI: Idle AI Tycoon" (:15) | SUPPORTED | SL:28 |
| 2 | Description: pixel-art idle tycoon, AI boom, garage to AGI, 100 layers (:17) | SUPPORTED | SL:30, SL:37 |
| 3 | Kicker "Idle AI tycoon · Pixel art · Portrait" (:18) | SUPPORTED | SL:37 |
| 4 | Hero lead (:19) | SUPPORTED | SL:35 (nearly verbatim) |
| 5 | "Coming soon to Google Play", no store link (:21) | SUPPORTED | Owner rule 4; CL:988 (production events from 30 Oct) |
| 6 | "iPhone version to follow" (:22) | UNSUPPORTED as a public promise | SL:3 → M2 |
| 7 | Icon alt: golden hoodie, sunglasses, neon AGI brain (:27) | SUPPORTED | SL:204 |
| 8 | HUD "PEBBLE-4 · TRAINING 44% · 70B PARAMS · ETA 25M 12S" (:30) | SUPPORTED | ModelLab.txt:9–24; Economy.txt:43 |
| 9 | Scene alt texts (garage, hyperscale, orbital, dyson, simulation, street, offline, banners) | SUPPORTED | Images inspected |
| 10 | Ten products per era; tap a cycle; hire a lead (:58) | SUPPORTED | SL:40–41 |
| 11 | GPUs and datasets; real-time training; ship → BENCH, multiplier, unlock (:64) | SUPPORTED | SL:45–46; Systems.txt:23–27 |
| 12 | Job Fair; 12 star hires follow every era with a new job and uniform (:70) | SUPPORTED | SL:53; Endgame.txt:73 |
| 13 | Cred +2% revenue forever (:76) | SUPPORTED | SL:58 |
| 13b | "Then move into a bigger world" as a result of selling (:76) | WRONG | Main.txt "You stay in this era." → M3 |
| 14 | Ten product names and taglines (:84–93) | SUPPORTED | Economy.txt:19–28 (verbatim) |
| 15 | Rounds Pre-seed … Titan (:96) | SUPPORTED | Main.txt `ROUNDS`; LiveOps.txt:7–15; CL:1362–1363 |
| 16 | First closes open Model Lab, Job Fair, Research, Exit, events, era map (:99) | SUPPORTED | CL:1364–1369; LiveOps.txt:6 |
| 17 | "Four loops, one number" (gameplay-section.tsx:10) | SUPPORTED (page framing) | Systems.txt:16 has five; the dropped loop is the chips one |
| 18 | "Ten new ones in every world after it" (gameplay-section.tsx:28) | UNSUPPORTED past Layer 16 | Layers.txt:6, :144 → H1 |
| 19 | Eras 1–4 and their rules (tutorial, grid limits, space cooling, solar flares) | SUPPORTED | Endgame.txt:32–51 |
| 20 | Garage / Hyperscale / Orbital / Dyson texts (:120, :130, :140, :150) | SUPPORTED | Endgame.txt:33–51 ("every 1.5 to 2.5 min", x3 for 20 s) |
| 21 | PEBBLE-8 is AGI; BOULDER-8 becomes ASI, with their lines (:123, :133) | SUPPORTED | Endgame.txt:20–23 |
| 22 | "COMET-8 thinks in planets" (:143) | UNSUPPORTED as a title (the line itself is supported) | Endgame.txt:24–25; Main.txt mindTitle → L1 |
| 23 | "PULSAR-8 finds the truth" (:155) | UNSUPPORTED (invented; the line itself is supported) | Endgame.txt:26–27 → L1 |
| 24 | Era 5 = Simulation; x10 per layer; back to the garage one layer down; Clear Layer 100 (:162–165) | SUPPORTED | Layers.txt:4–5; SL:60 |
| 25 | "Every layer brings a new model family, ten new products…" (:165) | UNSUPPORTED (overstated) | Layers.txt:6, :144; Progress.txt:106; SL:200 → H1 |
| 26 | PIXEL-8 sees the screen, with its line (:168) | SUPPORTED | Layers.txt:97; Endgame.txt:28–29 |
| 27 | LAG, DEJA VU, ECHO (:174, :175, :177) | SUPPORTED | Layers.txt:84, :86, :90 |
| 28 | OVERFIT "sure +5 BENCH" (:176) | SUPPORTED, leaves out +25% time | Layers.txt:88 → L2 |
| 29 | "Ship an era's eighth model to open the next world" (worlds-section.tsx:26) | SUPPORTED | Eras.txt:4 |
| 30 | Loss spike mid-run; roll back or push; the run waits while you are away (:185) | SUPPORTED | LiveOps.txt:49; CL:1346–1350; Main.txt spike at 30–70% of a run |
| 31 | Dialog: "LOSS SPIKE!", "PEBBLE-4 at step 308,000", body, "Safe: lose 8% progress", "50%: +3 BENCH · 50%: run takes 15% longer" (:187–191) | SUPPORTED | Main.txt dialog template, `incBody`, `pushSub`; ModelLab.txt |
| 32 | AGI moment: the mind wakes; the Garage street goes dark; beam; 6 s; trophy; Daily Token; share card; each era its own version (:198) | SUPPORTED | Endgame.txt:58–69; CL:1428–1450; BuildPlan.txt:102 |
| 33 | Daily Token headline (:201) | SUPPORTED | AGI.txt |
| 34 | Emergent ability "free boost" (:208) | WRONG (it is +2 BENCH) | CL:1400; LiveOps.txt:50 → H2 |
| 35 | Node failure "pay now or wait longer" (:208) | SUPPORTED as a mechanic, misleading wording | CL:1405 → M1 |
| 36 | Viral post floats over the HQ; tap for a burst (:215) | SUPPORTED | LiveOps.txt:48 |
| 37 | Founder walks, works, cheers, has tap lines; an outfit per era; Golden hoodie on the Hackathon track; no chores (:222) | SUPPORTED (outfit-per-era is broad, L3) | Founder.txt:4, :29, :80; CL:279–289, :917–918 |
| 38 | Outfit names (:224–228) | SUPPORTED | Founder.txt:9, 13, 17, 21, 27 |
| 39 | Time away: earns for hours, real-time runs, spike waits, Welcome back report (:235) | SUPPORTED | SL:73–74; CL:1342, :262–264; Offline.txt |
| 40 | Roster names, roles and rarities (:247–258) | SUPPORTED | TeamSystem.txt:19–90; LiveOps.txt:27–38 |
| 41 | Odds and pity counter shown (:263) | SUPPORTED (owner call, L4) | SL:55 |
| 42 | Hires follow every Exit and era; Ivy goes from Intern to Swarm Tech (:263) | SUPPORTED | TeamSystem.txt:4, :19–23 |
| 43 | Era specialists and glitch hunters (:263) | SUPPORTED (Garage has none, L3) | TeamSystem.txt:122, :135, :141 |
| 44 | Minds and their notes (:269–273) | SUPPORTED | Progress.txt:7–11 |
| 45 | Hidden-mind hints (:277) | SUPPORTED | HallOfMinds.txt:127–140 (Layers 10–12) |
| 46 | Hall: capstone joins; +5% in every era forever; ??? plus a hint (:281) | SUPPORTED | HallOfMinds.txt:93; Progress.txt:28–30; SL:61 |
| 47 | Keepsakes: trophy per era, achievements, daily rewards, HQ skins and titles (:282) | SUPPORTED | SL:69–70; CL:1454–1458, :1479, :1497, :1512–1520 |
| 48 | Events from Series D; four-week rotation plus seasonal; reward tracks; brackets of up to 50 (:335) | SUPPORTED | SL:64–66; CL:893–900, :993–994 |
| 49 | Week 1–4 order (:291–313) | SUPPORTED | LiveOps.txt:41–44; CL:893–894 |
| 50 | Hackathon Weekend text (:293) | SUPPORTED | LiveOps.txt:41; SL:197 |
| 51 | Benchmark Wars: 72 h; Research and incident bonuses count double (:300) | SUPPORTED | LiveOps.txt:42; CL:936–939 |
| 52 | GPU Shortage: GPU x2, loss spikes x3 (:307) | SUPPORTED | LiveOps.txt:43; CL:941–942 |
| 53 | Launch Week: seven daily missions (:314) | SUPPORTED | LiveOps.txt:44; CL:945–949 |
| 54 | Tet Hackathon and Hallucination Night are Hackathon reskins with HQ decor (:319–331) | SUPPORTED (decor is a reward, L3) | CL:895–897; LiveOps.txt:45 |
| 55 | "A new event every weekend." (events-section.tsx:10) | SUPPORTED | SL:64 |

## Positive observations

- The server/client split is right. `preload()` in the server component puts exactly one
  `<link rel="preload" as="font" crossorigin>` in the head of `/idle-ai-tycoon/` and on no other page (checked in `out/`).
- The default parameter on `pageMetadata` leaves every other page unchanged. The game page gets og/twitter image,
  size and alt tags, and a test covers `/about/`.
- All copy and data live in one typed content file. 53 of 55 claim rows check out, nearly all word for word from the
  listing or the boards.
- Contrast is at least 4.8:1 everywhere except the hidden-mind "???". Images carry their width and height (no layout
  shift) and lazy-load below the fold. Reduced motion is respected through the global rule.

## Recommended actions

1. Fix H1, H2, M1 and M3 in `src/content/idle-ai-tycoon.ts` and `gameplay-section.tsx:28`, and L1–L3 while you are there.
2. Settle M2 with the owner.
3. Extend the banned-words test (M4). Run it before the H2 fix: it should fail on "boost".
4. Low items as follow-ups, then tick plan phase 7.

## Metrics

- Types: no `any` in the new code; typecheck passes (per the caller). Lint: 0 problems (`npm run lint` on HEAD).
- Tests: 9 new tests, plus the page in PAGES (×4 widths, ×2 projects). No flaky timing found: the scroll test reuses the
  polling helpers and the font test awaits `document.fonts.ready`.
- Assets: 53 files, 77,089 B (`icon-512.png` is 50,295 B). Font: 5,160 B.
- Contrast: 1 text pair below AA (3.1:1).

## Unresolved questions

1. Did the owner approve "iPhone version to follow"?
2. Should "the odds and your pity counter" stay, on a page that must avoid monetisation signals?
3. Is the studio newsletter's "Subscribe" acceptable on the game page under rule 1? It is not the game's subscription.
4. Should mind titles always use the game's exact wording? This decides L1.
