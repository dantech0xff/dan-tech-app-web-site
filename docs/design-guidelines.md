# Design guidelines

Source of truth: Claude Design project "Dan Tech Landing Page Design", file `dantech.app.dc.html`
(project `434c0ddb-0b26-4d2f-847b-569ce1ad4099`). The site reproduces it 1:1; change the design there first.

## Intentional differences from the design

| Since | Change | Reason |
| --- | --- | --- |
| 2026-10-11 | Home: the numbers band under the product marquee (10M+ downloads, 10+ products, 14 years, 01 person) is removed. The marquee is followed directly by "Three products, one standard." | Owner's request |

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
| `--duoly` / `--gold` / `--academy` / `--star` | `#FF4D79` / `#E0B33A` / `#3DDC84` / `#FFC94A` | Product accents, review stars |
| `--surface` + `--surface-shadow` | `#212129 → #1B1B1F` gradient + inset/drop shadow | Cards |
| `--tile` + `--tile-shadow` | `rgba(250,250,252,0.045)` + inset line | Small stat tiles, game cards |
| `--page-max` / `--gutter` | `1240px` / `clamp(20px, 5vw, 64px)` | Content width and side padding |
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
- `dt-pulse` (live dots), `dt-float` (hero app icon), `dt-marquee` (product strip, 40 s loop).

## Building blocks

- `PhoneMockup` — `regular` (hero/product, 200–264 px), `large` (Kim Tài, 220–280 px), `card` (230 px inside
  home cards); `statusInk="dark"` over light Duoly screens, `"light"` over Kim Tài.
- `PageHero` — inner-page headline + lead (+ chips or email link).
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
| `dantech-mark.png`, `academy-logo.png`, `duoly-icon.png`, `kbc.png`, `woody.png`, `katsu.png` | Design project (exact files) |
| `kimtai-icon.png` | Pixel-identical original from `kim-tai-landing-page/public/icons/kim-tai-pwa-512.png` (the design copy exceeded the 256 KiB DesignSync download cap) |
| `kimtai-screen-ledger.png`, `duoly-screen-today.png`, `duoly-screen-duo.png` | Rebuilt: the design copies were truncated by the download cap. The top 34–79% of each is the design's exact pixels; the rest is the same screen from the ASO exports (Kim Tài `public/iphone-1284x2778/02-so-vang.png` on GitHub; Duoly `export/appstore/iphone-en/01-today.png` and `11-duo.png`), straightened and scaled to the crop. Swap in the design project's files whenever they can be downloaded whole. |

## Verifying parity

Render the design with its own runtime (serve the exported project folder and open
`dantech.app.dc.html#/<page>`), then compare full-page screenshots, `innerText` and computed styles with the
static export at 1440, 1024, 768 and 390 px with reduced motion enabled.
