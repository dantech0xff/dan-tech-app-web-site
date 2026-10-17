# Design guidelines

Source of truth: Claude Design project "Dan Tech Landing Page Design", file `dantech.app.dc.html`
(project `434c0ddb-0b26-4d2f-847b-569ce1ad4099`). The site reproduces it 1:1; change the design there first.

## Intentional differences from the design

| Since | Change | Reason |
| --- | --- | --- |
| 2026-10-11 | Home: the numbers band under the product marquee (10M+ downloads, 10+ products, 14 years, 01 person) is removed. The marquee is followed directly by the products teaser. | Owner's request |
| 2026-10-11 | Space above every hero (home, inner pages, legal pages) is `--hero-pad-top: clamp(32px, 4vw, 56px)` instead of the design's `clamp(56px, 8vw, 104px)` (home: 112px). | Owner's request: heroes started too far below the header |
| 2026-10-11 | Dan Tech Academy is gone from the site, which now presents the mobile apps only. Removed: the home Academy card, the Academy marquee items (Dan Tech Academy, Mobile Action Pro, Kotlin Accelerator), the "Success, shared" principle, the Academy review, the `/products/#academy` section and chip, the footer links, the FAQ answers about learning, the contact topic "Academy / coaching", the About "Visit the Academy" button and the `--academy` token. Copy that described a school or teaching now speaks of the apps (hero platforms "Android & iOS"; the products headings are in the next row). Earlier work uses the plain background so the products page still alternates. The marquee repeats its five items three times per group and runs 70 s, which keeps the design's speed (about 44 px/s) without a gap on screens up to about 3,000 px wide. | Owner's request: focus on the mobile apps |
| 2026-10-11 | Copy never says how many apps there are, so adding an app needs no copy change: home teaser "Different apps, one standard.", products hero "Every app, built end-to-end by one person." with the lead "Consumer apps on Google Play and the App Store. …", and the products description "Duoly in Love, Kim Tài · Tick Vàng Online and more — …". Keep new copy count-free too. | Owner's request: more apps are coming |
| 2026-10-17 | Home: the products teaser shows the games next to the apps, four cards (two columns on screens from about 870px wide): 03 · 1010! Block Puzzle and 04 · Garage to AGI after Duoly in Love and Kim Tài. 1010! has no page, so its card is not a link: Google Play and App Store buttons, stacked, sit where "Learn more" sits and above the tilted phone where it reaches them, and the card does not lift on hover (`a.card:hover`). Garage to AGI's card links `/idle-ai-tycoon/` and shows the game's garage scene in a window like its page's hero, above "Learn more", instead of a phone. The marquee adds both games after Kim Tài (seven items, three times per group, about 4,400px) and runs 100 s to keep about 44 px/s. Accents: 1010! orange `#FF6B35` (its wordmark's "!"), Garage to AGI lime `#A7F070` glow and gold `#FFCD75` icon shadow (as on its page). | Owner's request |
| 2026-10-11 | No page is wider than a phone screen; a Playwright test checks 320, 360, 375 and 390 px. In the design, `/products/` scrolled sideways below about 400 px: the one-line eyebrow "01 · For couples · formerly Amor AI" made it up to 26 px too wide (10 px at the 390 px parity width), and at 360 px and narrower the tilted Duoly phones reached past the edge too. On `/faq/` the answer list ran 8 px off a 320 px screen. Product eyebrows now wrap, but only after a "·" (`ProductIntro` joins the words of each part with no-break spaces). They use `11px/17px` with `-3px` block margins, which keeps a single line on the design's exact pixels. Product sections clip sideways overflow (`overflow-x: clip`), and the FAQ grid's column minimum is `min(100% - 48px, 260px)`. At 430 px and wider nothing moves. | Pages scrolled sideways on phones |

## Garage to AGI page (idle AI tycoon)

`/idle-ai-tycoon/` is not in the Claude Design project. It is the landing page of the owner's game (private repo
`dantech0xff/flutter-idle-ai-lab`), added 2026-10-12. It keeps the site's tokens, type and surfaces and adds the game's look.
Code: `src/app/idle-ai-tycoon/`, `src/components/idle-ai-tycoon/` (one CSS module), copy and data in
`src/content/idle-ai-tycoon.ts`; the closing newsletter section is the home page's.

- **Copy rules (owner).** Never mention ads, purchases, subscriptions, premium currency or upgrades; describe only
  special features the game has today. That includes the game's own paid-feature words: "boost" (its x2 boost is an ad and
  subscription perk, so an emergent ability "adds +2 BENCH", never "a free boost"), Overclock, VC Backing, Founder Pass,
  Starter Pack, Server Uptime, Board Seat. The sources are the game's `docs/prototype/` boards and `docs/store/listing.md`
  (the first store build); where they disagree the listing and the game's `CLAUDE.md` win. Left out until the app has
  them: the weekly deepest-layer board, content drops (the model families repeat after Layer 16, so no "new family and ten
  new products on every layer") and titles other players see. Use the game's own wording for names and titles ("COMET-8
  becomes a planetary mind"). Keep counts to the stable ones (ten products and eight models per era, twelve star hires,
  100 layers) and give none for minds, achievements or specialists, which grow. English, like the rest of the site. All
  copy sits in `src/content/idle-ai-tycoon.ts`. A Playwright test scans the page text, alt texts, aria labels, image file
  names and metadata for the banned words and the unreleased features.
- **Status.** The game is out on Google Play (released 2026-10-15), so the hero says "Out now on Google Play"
  next to a Google Play `StoreButton` (`components/store-button.tsx`), with no promise of an iPhone release.
- **Home card.** The game's card on the home page (`GarageToAgiCard` in `components/home/products-teaser.tsx`) takes its
  words from `game.card` and follows the same rules; a test scans its text, alt texts and file names.
- **Structured data.** `gamePage()` in `src/lib/structured-data.ts` marks the page up as a `VideoGame` from the same content file and links the Google Play listing (`sameAs`, `installUrl`); it states no offer, rating or release date. The banned-word test scans it like the visible copy. Its line in `llms.txt` (built from the same content) follows the same rules, and a test checks it.
- **Share card.** `share/idle-ai-tycoon.png` says only the game's name and genre ("Idle AI tycoon · Pixel art"): no status, price, ads or release wording, so it never goes stale and obeys the copy rules. Re-render it with `npm run share-images` after changing `scripts/share-images/game.html` or the art it uses.
- **Palette.** The game's own (Sweetie 16), declared on `.page` in `game.module.css`: `--g-ink #1A1C2C`, `--g-panel #333C57`,
  `--g-lime #A7F070`, `--g-gold #FFCD75`, `--g-orange #EF7D57`, `--g-blue #41A6F6` and the rest. Rarity frames use the game's
  colours (Common `#94B0C2`, Rare `#41A6F6`, Epic `#B13E53`, Legendary `#FFCD75`). Everything else is the site's tokens.
- **Pixel art.** Always drawn with `image-rendering: pixelated` (`.pixel`). Sprites are 16×16, shown at a whole multiple:
  2x (32px, the minds in the era cards and the hero's training icon), 3x (48px) or 4x (64px); scenes (128×48, 128×40,
  128×64) scale with their box. The app icon is `icon-256.png` in the hero (it is shown at 120px or less) and `icon-512.png`
  for the share card. Do not use the game's `docs/store/screenshots/`: they date
  from 2026-09-27, before the Layer 100 ending and the font change, and the game's listing doc says not to publish them.
  The loss-spike dialog is rebuilt in CSS from the game's `Main.dc.html` (colours, wording, bevelled buttons); it is a picture
  with `role="img"` and an `aria-label` built from the same strings, so its numbers reach assistive tech too.
- **Font.** Jersey 10 (SIL Open Font License), the Latin subset Google Fonts serves, in `public/fonts/jersey-10.woff2` with
  its `@font-face` in `game.module.css`, preloaded by the page through `preload()` from `react-dom`. It is not loaded with
  `next/font`: in this static export that preloaded the font on every page, home included. nginx caches `/fonts/` as
  immutable, so a replacement file needs a new name.

## Tokens (`src/app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#16161A` | Page background, text on light buttons |
| `--bg-alt` | `#1B1B1F` | Alternate sections, contact "sent" panel |
| `--bg-footer` | `#121215` | Footer |
| `--bg-field` | `#111114` | Inputs |
| `--bg-phone` | `#0B0B0E` | Phone mockup frame |
| `--fg` | `#FAFAFC` | Text; secondary text uses `rgba(250,250,252,α)` |
| `--accent` / `--accent-hover` | `#0A84FF` / `#3B9DFF` | Links, primary buttons, markers |
| `--duoly` / `--gold` / `--star` | `#FF4D79` / `#E0B33A` / `#FFC94A` | Product accents, review stars |
| `--surface` + `--surface-shadow` | `#212129 → #1B1B1F` gradient + inset/drop shadow | Cards |
| `--tile` + `--tile-shadow` | `rgba(250,250,252,0.045)` + inset line | Small stat tiles, game cards |
| `--page-max` / `--gutter` | `1240px` / `clamp(20px, 5vw, 64px)` | Content width and side padding |
| `--hero-pad-top` | `clamp(32px, 4vw, 56px)` | Space between the header and every page hero |
| `--anchor-offset` | `72px` on desktop; header height + 3px when the header wraps | Sticky header clearance (`scroll-padding-top`) for anchors and focus |

Type: Be Vietnam Pro (400–700) for text, IBM Plex Mono (400–500) for labels and meta, Material Symbols
Outlined for icons. Headings use tight negative letter-spacing (−0.02 to −0.04em); mono labels use wide
positive tracking and uppercase. All fonts are self-hosted: next/font for the text faces, and
`public/fonts/material-symbols-outlined.woff2` (only the icons in use) declared in `globals.css`. After adding
or removing an icon, add its name to `scripts/update-icon-font.mjs` and run `npm run icons:update`.

## Motion

Global utility classes, all disabled under `prefers-reduced-motion: reduce`:

- `dt-reveal-50|60|70` — scroll-driven fade-up (`animation-timeline: view()`); the number is where in the
  entry range it completes. Browsers without scroll timelines show the final state.
- `dt-pulse` (live dots), `dt-float` (hero app icon), `dt-marquee` (product strip; 40 s per loop, which
  `ProductMarquee` sets to 100 s for its longer groups: retune it when items change, at about 44 px/s).

## Building blocks

- `PhoneMockup` — `regular` (hero/product, 200–264 px), `large` (Kim Tài, 220–280 px), `card` (230 px inside
  home cards); `statusInk="dark"` over light Duoly screens, `"light"` over Kim Tài.
- `PageHero` — inner-page headline + lead (+ chips or email link).
- `StoreButton` — the light Google Play / App Store badge, opening the listing in a new tab.
- `ui.module.css` — primary/secondary/light buttons, arrow links, tags, surface.
- `Icon` — Material Symbols glyph; only sets family, size and line height so weight and colour inherit.
- `SiteLink` — every internal link; handles section anchors and scroll behaviour.

## Rules that keep the build identical to the design

1. Copy values from the design verbatim (colours, `clamp()`s, line heights, shadows). Hover rules must keep
   any colour the design does not change, because the global `a:hover` would otherwise recolour the link.
2. Reference fonts by family name (`--font-sans`, `--font-mono`, `--font-body`), not through next/font's CSS
   variables: those append an Arial-based fallback that draws missing glyphs (→ ↗ ★) differently.
3. Write only the unprefixed `backdrop-filter`; the CSS compiler adds `-webkit-`. Declaring the prefixed form
   after the standard one made the compiler drop the standard property (Chrome lost the header blur).
4. Hover transforms on elements that also run `dt-reveal-*` need `!important`; filled animations otherwise
   override them (the design applies hover styles with `!important`).
5. Keep a heading's text in one text node (template string) when it mixes numbers and words; split React
   text nodes shifted glyph positions by a subpixel.
6. Images: `width`/`height` attributes are fine where CSS sets both dimensions; where CSS sets only width,
   also set `height: auto` so the attribute does not stretch the image.
7. The header stays sticky at every width (the prototype runtime let it scroll away after one screen; that
   was a side effect of its 100%-height wrapper). Anchor scrolling therefore measures the header instead of
   assuming 72px.

## Assets (`public/assets`)

| File | Source |
| --- | --- |
| `dantech-mark.png`, `duoly-icon.png`, `kbc.png`, `woody.png`, `katsu.png` | Design project (exact files) |
| `share/site.jpg`, `share/idle-ai-tycoon.png` | Share cards, 1200×630, rendered from `scripts/share-images/*.html` by `npm run share-images`. The studio's is the home hero tightened for a card (a JPEG, 115 KB, because of its gradients and screenshots); the game's is the title in Jersey 10 over the garage scene at x10 with the app icon at x6 (a PNG, to keep the pixel art sharp). Both stay under 300 KB, which some apps (WhatsApp) still ask for. |
| `idle-ai-tycoon/*` | Exact files from the game repo (`assets/images/{eras,crew,products,ui}/`), renamed to kebab-case: scenes `s_scene_garage` → `scene-garage`, `s_hq_hyper` → `scene-hyperscale`, `s_hq_orbit` → `scene-orbital`, `s_hq_dyson` → `scene-dyson`, `s_scene_glitch` → `scene-simulation`, `s_agi_street` → `scene-agi-street`; events `s_event_{hackathon,benchmark,shortage,launch,tet,halloween}` → `event-{hackathon,benchmark,gpu-shortage,launch-week,tet,halloween}`; crew `c_<name>` → `crew-<name>` (`c_founder_gold` → `crew-founder-gold`) and `t_founder_{hyper,orbit,dyson}` → `crew-founder-{hyperscale,orbital,dyson}`; minds `i_brain` → `mind-pebble`, `brain_{boulder,comet,pulsar}` → `mind-*`, `brain_sim` → `mind-layer`; products `p_<name>` → `product-<name>`; icons `i_{garage,gpu,team,cred,warn,sparkle}` → `icon-*`; `s_viral` → `art-viral-post`, `s_offline` → `art-offline`. The app icon is `docs/store/icon/google-play/icon-512-jackpot-agi.png` as `icon-512.png`, and `icon-256.png` is that file halved. The owner holds every right to the art, marketing use included (`docs/legal/art-provenance.md` in that repo). |
| `1010-icon.png` | The 1010! game repo's `Assets/Block Puzzle/Images/1010-app-icon-512x512.png` (the App Store icon), halved to 256px. |
| `1010-screen-board.png` | The in-phone screen of the owner's Google Play screenshot "10×10. NO TIMER." (1080×1920): its status bar painted over with the screen colour `#1C1C1C` (the mockup draws its own), cut just above the pieces in the trays, the empty trays extended down to the card phone's aspect, 428×954. Replace it with a real capture of the game when there is one. |
| `kimtai-icon.png` | Pixel-identical original from `kim-tai-landing-page/public/icons/kim-tai-pwa-512.png` (the design copy exceeded the 256 KiB DesignSync download cap) |
| `kimtai-screen-ledger.png`, `duoly-screen-today.png`, `duoly-screen-duo.png` | Rebuilt: the design copies were truncated by the download cap. The top 34–79% of each is the design's exact pixels; the rest is the same screen from the ASO exports (Kim Tài `public/iphone-1284x2778/02-so-vang.png` on GitHub; Duoly `export/appstore/iphone-en/01-today.png` and `11-duo.png`), straightened and scaled to the crop. Swap in the design project's files whenever they can be downloaded whole. |

## Verifying parity

Render the design with its own runtime (serve the exported project folder and open
`dantech.app.dc.html#/<page>`), then compare full-page screenshots, `innerText` and computed styles with the
static export at 1440, 1024, 768 and 390 px with reduced motion enabled.
