---
title: dantech.app built from Claude Design with verified parity
date: 2026-10-11
summary: "Static Next.js 16 site reproducing dantech.app.dc.html; parity checks caught font-fallback, backdrop-filter and text-node bugs; review fixes applied; 42/42 tests."
---

# dantech.app built from Claude Design with verified parity

## What happened
- Imported the Claude Design project "Dan Tech Landing Page Design" (`dantech.app.dc.html`, DC runtime, 7 hash-routed screens) through DesignSync after `/design-login`.
- DesignSync `get_file` caps responses at 256 KiB: 5 PNGs came back truncated.
  - `kimtai-icon.png`, `1010-icon.png`: decoded rows matched GitHub originals byte-for-byte in pixels (`kim-tai-pwa-512.png`, `block-puzzle-transparent.png`), so the originals were used.
  - `kimtai-screen-ledger.png`, `duoly-screen-today.png`, `duoly-screen-duo.png`: kept the decodable top rows (exact pixels) and rebuilt the rest from the App Store screenshots (`02-so-vang.png` on GitHub; `~/Desktop/export/appstore/iphone-en/01-today.png`, `11-duo.png`), straightened (≈2.1–2.8° tilt) and scaled (≈1.43–1.67) via template matching on avatar circles.
- Built Next.js 16.4 App Router + React 19 static export, CSS Modules mirroring the design's inline styles, real routes with trailing slashes.

## Root causes found by parity checks (design runtime vs build)
- next/font CSS variables append an Arial-based fallback face (size-adjust 110–135%); glyphs missing from the web fonts (→ ↗ ★) rendered wider than the design's plain `sans-serif`/`monospace` fallback. Fix: reference "Be Vietnam Pro"/"IBM Plex Mono" by family name in tokens. `adjustFontFallback: false` had no effect in 16.4.
- Lightning CSS treated `-webkit-backdrop-filter` declared after `backdrop-filter` as an override and dropped the standard property; Chrome lost the header blur. Fix: declare only the unprefixed property.
- React text-node splits (`{n}. {title}`) shifted glyphs by a subpixel; use one template string.
- Global `a:hover` recolours class-styled links that had inline colours in the design; hover rules must restate the colour.

## Review fixes (plans/reports/code-reviewer-261011-1037-dantech-website-review.md)
- Footer year: server snapshot evaluated in the browser → hydration error from 2027. Build year now passed from the server component.
- Sticky header wraps to 125–169 px on phones; anchors now clear the measured header (72 px desktop unchanged) via `--anchor-offset` + `scroll-padding-top`, with hash re-alignment on load.
- Reduced motion disables smooth scroll; scroll intent keyed by path (Back no longer hijacked); per-page OG/Twitter; form focus management; 10 s newsletter timeout; preview server hardened; `trailingSlash: true` (route folders work on any static host); icon font self-hosted (18 KB subset, no third-party requests).

## Outcome
- Screenshot, innerText, computed-style and hover/focus parity across 7 pages × 1440/1024/768/390 px: identical heights and text; residual ≤44 px antialiasing.
- Lint, typecheck, build clean; Playwright 42/42 (desktop + Pixel 7).

## Next steps
- Replace the 3 rebuilt app screens with the design project's originals if they can be downloaded whole.
- Choose a newsletter endpoint (`NEXT_PUBLIC_NEWSLETTER_ENDPOINT`); mailto fallback until then.
- Decide whether the sticky header should stay sticky on phones (design intent kept for now).

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
