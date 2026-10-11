# dantech.app website from Claude Design

Status: done · Created 2026-10-11

## Outcome
Production website for dantech.app that reproduces the Claude Design project
"Dan Tech Landing Page Design" (`dantech.app.dc.html`) visually 1:1, with real routes
and working interactions.

## Source of truth
- Design file: `dantech.app.dc.html` (DC runtime, 7 hash-routed screens).
- Assets: `assets/*.png` from the design project. Files above 256 KiB were truncated by
  the DesignSync MCP; icons were restored from pixel-identical GitHub originals, app
  screens were rebuilt (exact top rows + App Store screenshots).

## Decisions
- Stack: Next.js 16 App Router + React 19 + TypeScript, `output: "export"` (static), CSS
  Modules + global tokens. Matches the owner's other landing pages (duoly, kim-tai).
- Routes: `/`, `/products/`, `/about/`, `/contact/`, `/faq/`, `/privacy/`, `/terms/` (real
  paths instead of the prototype's `#/page` hashes; trailing slash like the kim-tai site).
  Product anchors clear the header: 72px on desktop, measured header height on phones.
- Newsletter: POST to `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`; mailto fallback when unset.
- Contact: mailto with the design's subject/body format, then the "sent" state.
- Sticky header stays sticky for the whole page (the prototype runtime's 100%-height
  host clipped it after one viewport; that is a runtime artifact, not design intent).

## Non-goals
- No CMS, analytics, i18n or backend beyond the newsletter endpoint hook.

## Phases
1. [done] Scaffold project, tokens, fonts, assets — `npm run build` exports.
2. [done] Shared shell: header (active dot), footer, scroll/anchor behaviour.
3. [done] Pages: Home, Products, About, Contact, FAQ, Privacy, Terms (+ 404, sitemap, robots).
4. [done] Verification: lint, typecheck, build, 34 Playwright tests (desktop + mobile), screenshot +
   text + computed-style + hover/focus diff vs the original design at 1440/1024/768/390 px.
5. [done] Docs: README + docs/ (overview, codebase summary, design guidelines, deployment).
6. [done] App screens rebuilt: exact top rows from the truncated design files + the App Store
   screenshots (straightened, scaled) for the rest. Replace with originals if they become downloadable.
7. [done] Code review fixes (reports/code-reviewer-261011-1037-dantech-website-review.md): build-year
   hydration, header-aware anchor offset, reduced motion, scroll intent per path, per-page share metadata,
   form focus, fetch timeout, preview-server hardening, trailing-slash export, self-hosted icon font.

## Acceptance criteria
- Every screen matches the design at desktop, tablet and phone widths (screenshot diff
  reviewed; residual differences explained).
- Navigation, FAQ accordion, newsletter and contact flows work without console errors.
- Lint, typecheck, build and tests pass.
