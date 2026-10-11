# Code review: dantech.app static site

Date: 2026-10-11 (Asia/Singapore). Plan: `plans/261011-1037-dantech-website-from-claude-design/plan.md` (not modified; the brief said to modify no files).

## Code Review Summary

### Scope
- **Files reviewed:**
  - `src/app/**`, `src/components/**`, `src/lib/**` and `src/content/**`.
  - `scripts/serve-static.mjs` and `tests/**`.
  - `next.config.ts`, `eslint.config.mjs` and `playwright.config.ts`.
  - The exported HTML in `out/`.
- **Lines analysed:** about 2,350 lines of TS/TSX/MJS. I also read about 2,000 lines of CSS, but only for behaviour, not styling.
- **Review focus:** correctness, robustness, accessibility that can change without visual change, and static export/SEO. There are no visual or styling proposals.
- **How things were checked:**
  - ESLint and `tsc --noEmit --incremental false` were run. Neither writes files.
  - Behaviour was checked with Playwright probes. They ran against a private copy of the preview server on port 4399, using the existing `out/`.
  - The probe scripts are in the session scratchpad, not in the repo. No project files were touched apart from this report.

### Overall Assessment
The code is small, readable and mostly sound. The scroll design works for normal clicks, for back/forward and under StrictMode.

Two problems need a fix before launch:
- The footer year causes a hydration failure on every page from 1 Jan 2027, unless the site is rebuilt.
- On 390 px phones, the fixed 72 px anchor offset leaves product headings under the header, which is now always sticky.

The Medium items are cheap to fix and none of them changes visuals. They cover reduced motion, per-page Open Graph, a scroll-intent race, form focus and announcements, a fetch timeout and preview-server crashes.

### Critical Issues
None.

### High Priority Findings

**H1. The footer year causes a hydration mismatch once the visitor's year differs from the build year.** Location: `src/components/current-year.tsx:6,10-14`.

- **Cause:** `BUILD_YEAR = new Date().getFullYear()` also runs at module load in the browser. On the client, the "server snapshot" is therefore the visitor's year, not the year written into the HTML.
- **Scenario:**
  - The site is built in 2026 and visited on 2 Jan 2027. The HTML says 2026 but the hydration snapshot says 2027, so React throws error #418 (text mismatch).
  - I verified this on `/about` with the Playwright clock set to 2027-01-02: `Minified React error #418` was thrown as a page error. With today's date there is no error.
  - The footer sits in the root layout. React therefore throws away the server HTML up to the nearest Suspense boundary, which here is effectively the whole document, and re-renders it on the client.
  - This happens on every page load until someone rebuilds. A device with a wrong clock hits it at any time.
- **Fix:** let the server component pass the build year. That value is serialized into the RSC payload, so both sides use the same number:
  ```tsx
  // site-footer.tsx (server component, evaluated at build time)
  © <CurrentYear buildYear={new Date().getFullYear()} /> Dan Tech Indiv. All rights reserved.

  // current-year.tsx
  export function CurrentYear({ buildYear }: { buildYear: number }) {
    const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => buildYear);
    return <>{year}</>;
  }
  ```
  With this change React hydrates with the build year, then re-renders with the current year and raises no error. Add a test that calls `page.clock.setFixedTime(<next year>)` and asserts there are no page errors.

**H2. On phones, anchor links leave the target heading under the sticky header.** Locations: `src/lib/scroll.ts:2,28`, `src/app/globals.css:37` and `src/components/products/products.module.css:37`.

- **Cause:**
  - The 72 px offset assumes a single-row header, which is 69 px tall.
  - `.nav` wraps (`site-header.module.css:16-18`), so the header is 125 px tall at 412 px (Pixel 7) and 169 px at 390 px.
  - In the prototype the header scrolled away. Here it stays sticky, so a 72 px offset no longer clears it.
- **Measured at 390 px after following each product link:** every section's top lands at 72 px, but the header ends at 169 px.

  | Target | First content top | Covered by header |
  | --- | --- | --- |
  | Duoly, Academy | `h2` at 154 px | 15 px of the heading; the icon and eyebrow completely |
  | Earlier work | `h2` at 129 px | 40 px |
  | Kim Tài | phone mockup at 158 px | 11 px |

  Direct visits to `/products#…` use the same 72 px `scroll-margin-top`, so they land the same way. At 412 px the content clears the header by only 4 px. `tests/site.spec.ts:65,73` assert the fixed 72 px, so the mobile project passes even though the heading is covered.
- **Fix:** the desktop result stays identical, because 69 + 3 = 72.
  - Derive the offset from the header when scrolling, for example `Math.max(72, header.offsetHeight + 3)`.
  - Mirror the same value into `--anchor-offset` with a ResizeObserver on the header.
  - Optionally apply it as `html { scroll-padding-top: var(--anchor-offset) }` instead of the per-section `scroll-margin-top`. This also keeps keyboard focus from hiding under the header (WCAG 2.4.11).
  - Change the deep-link tests to assert `sectionTop >= headerBottom`.
  - Update the "72 px" wording in `docs/codebase-summary.md` and `docs/design-guidelines.md`.

### Medium Priority Improvements

**M1. Smooth scrolling ignores `prefers-reduced-motion`.** Locations: `src/lib/scroll.ts:29,32` and `src/components/site-link.tsx:33`.
- **Problem:** the CSS turns animations off under reduced motion, but `window.scrollTo({ behavior: "smooth" })` still animates.
- **Evidence:** with reduced motion emulated, a same-page jump to `#earlier` fired 52 intermediate scroll events.
- **Why it matters:** "Respect reduced-motion preferences" is a stated requirement in `docs/project-overview-pdr.md:17`.
- **Fix:** in `scrollToSection`, use `"auto"` whenever `matchMedia("(prefers-reduced-motion: reduce)").matches`.

**M2. A pending navigation's scroll intent leaks into the Back button.** Locations: `src/lib/scroll.ts:9-19` and `src/components/scroll-on-navigate.tsx:11-17`.
- **Problem:** the intent is not tied to its destination, so the next pathname change uses it, whatever that change is.
- **Reproduced:**
  1. On `/faq`, scroll to y=600, then go to Home and scroll to the bottom.
  2. Click the footer "About" link while the `/about` payload is delayed by 4 s.
  3. Press Back.
  - **Result:** the page lands on `/faq` at y=0, and the probe recorded `ScrollOnNavigate` calling `scrollTo({top:0})`.
  - **Control:** without the pending click, Back restores y=600.
- **When it happens:** on slow mobile networks, when someone taps a link, waits, and then taps Back.
- **Fix:**
  - Store `{ pathname: href, anchor }` in `setScrollIntent`.
  - In `takeScrollIntent(pathname)`, always clear the slot, but return the anchor only when `pathname` matches.

**M3. Every page shares the home page's Open Graph and Twitter tags.** Location: `src/app/layout.tsx:41-48`.
- **Problem:** pages set `title`, `description` and `canonical` but not `openGraph`, so they inherit the root's values.
- **Evidence:** the built `out/about.html` contains:
  - `og:url = https://dantech.app`;
  - `og:title` and `twitter:title` = "Dan Tech Indiv. — Apps make life more convenient";
  - the home page description.
- **Impact:**
  - When /about, /products or /faq is shared on Facebook, LinkedIn, Zalo or X, the preview card is the home page's.
  - Facebook also attributes those shares to the home URL.
- **Fix:**
  - Add a `pageMetadata({ title, description, path })` helper. It returns `title`, `description`, `alternates.canonical` and `openGraph: { ...sharedOpenGraph, url: path, title, description }`.
  - A child's `openGraph` replaces the parent's object, so spread the shared image, `siteName` and `type` into it.
  - Check the `twitter:*` tags in the build afterwards.

**M4. Form results are not reliably announced, and focus is lost.** Locations: `src/components/home/newsletter-form.tsx:32-39` and `src/components/contact-form.tsx:35-48`.
- **Problems:**
  - On success, the submit button that has focus is unmounted and replaced by a new `role="status"` node, so focus falls to `<body>`.
  - Live regions that are inserted together with their text are often not announced (for example NVDA or JAWS with Chrome).
  - "Write another" unmounts its own button in the same way.
- **Impact:** keyboard and screen-reader users get no reliable confirmation. This matters most once a newsletter endpoint is set, because then no mail app opens to signal that something happened.
- **Fix without visual change:**
  - Give the confirmation container `tabIndex={-1}` and focus it when it mounts. Optionally add `outline: none` on that container only.
  - Focus the name field after "Write another".
  - Alternative: keep a visually hidden `role="status"` element mounted at all times.

**M5. The newsletter request has no timeout.** Location: `src/lib/newsletter.ts:20-24`.
- **Problem:** if the endpoint hangs (a cold-starting function or a stalled proxy), the button stays disabled in the "sending" state. No message appears until the browser gives up on the request, which can take minutes.
- **Scope:** this applies only once `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is set.
- **Fix:** add `signal: AbortSignal.timeout(10_000)` to the fetch. The abort then lands in the existing error state.

**M6. One malformed request can kill the preview/test server.** Location: `scripts/serve-static.mjs:27,40,46,47`.
- **Cause:** `decodeURIComponent` and `new URL` can throw inside the async handler. Nothing catches the error, so Node exits on the unhandled rejection.
- **Reproduced:**
  - `GET /%` fails with `URIError: URI malformed`.
  - `GET http://[::1/` fails with `TypeError: Invalid URL`.
  - Both requests ended the process.
- **Other crash paths:**
  - `createReadStream` has no `error` listener. A file deleted mid-request, for example by a rebuild while the server is serving, also crashes it.
  - `listen(port)` binds every network interface, so anyone on the LAN can trigger these crashes.
  - A crash during `npm test` takes the Playwright web server down with it.
- **Fix:**
  - Wrap the handler in try/catch and answer 400.
  - Add `stream.on("error", …)` that ends the response with a 500.
  - Use `listen(port, "127.0.0.1")`.
- **Not affected:** the protection against path traversal is correct (see Positive Observations).

### Low Priority Suggestions

**L1. Trailing-slash URLs lose the active-page state.** Locations: `site-link.tsx:30` and `nav-links.tsx:21`.
- **Problem:** the preview server answers `/about/` with 200 and the URL keeps the slash. `usePathname()` then returns `/about/`, so I verified that "About" loses `aria-current` and its active dot. Same-page links also turn into full client navigations.
- **Risk:** most hosts redirect to the URL without the slash, so the main risk is that the preview server behaves differently from production.
- **Fix:** normalise with `pathname.replace(/\/$/, "") || "/"`, or make the preview server answer `/x/` with a 308 redirect to `/x`.

**L2. FAQ `aria-controls` points at elements that do not exist.** Location: `faq-list.tsx:28`.
- **Problem:** collapsed answers are not rendered, so the reference points at nothing.
- **Fix:** `aria-controls={open ? answerId : undefined}`.

**L3. Some accessible names are duplicated or noisy.** All of these fixes are invisible.
- `brand-lockup.tsx:15`: the header logo link reads "Dan Tech dan tech indiv.". Use `alt=""`, because the wordmark already names the link.
- `earlier-work-section.tsx:17`: the game images repeat the visible game title. Use `alt=""`.
- `phone-mockup.tsx:21`: screen readers hear "9:41" inside every card link. Add `aria-hidden="true"` to the status bar.
- `home-hero.tsx:35`: the decorative app icon in the hero could use `alt=""`.

**L4. The mailto links have three smaller problems.** Locations: `mailto.ts:11,17` and `contact-form.tsx:44,82-88`.
- **Line breaks:** RFC 6068 asks for `%0D%0A` line breaks. Replace `\n` with `\r\n` before encoding, and update the unit test.
- **URL length:**
  - Vietnamese text roughly triples in length when encoded: a 400-character message became a 1,247-character URL.
  - Some Windows and Outlook handlers fail at around 2,000 characters, while the UI still shows "sent".
  - The existing fallback text already covers this. A `maxLength` on the textarea would also cap the length.
- **Lost message:** "Write another" remounts an empty form, so someone whose mail app did not open loses what they typed. Keep the values in state, or hide the form instead of unmounting it.

**L5. The icon list is not alphabetical, although its comment says it must be.** Location: `layout.tsx:25-30`.
- The list ends with `wifi,widgets`. Google returns the same font kit URL for either order (I checked), so nothing breaks.
- Fix the order or the comment.

### Positive Observations
- **Back/forward works:** same-page links keep Next's history state.
  - Going `/products#earlier` → `/about` → Back restored y=2831 with the section at 72 px.
  - Forward returned to `/about` at the top.
  - Home → Kim Tài card → Back restored the Home scroll position of 1331 px exactly.
- **No stale frame on page change:** the jump to the top of a new page happens in the first frame after the page commits, so a frame at the old position is never painted. I measured this in 12 of 12 runs.
- **StrictMode is safe:** the animation frame is cancelled in the cleanup function.
- **Path traversal is blocked:** the preview server returned 404 for `/..%2F..%2Fetc%2Fpasswd` and `/%2e%2e/%2e%2e/…`.
- **Mailto values are encoded:** all mailto parameters go through `encodeURIComponent`, and the tests decode subject and body round-trip.
- **Accessibility basics are in place:**
  - Icons are `aria-hidden`, and most decorative images have `alt=""`.
  - The FAQ uses `aria-expanded`, and the navigation uses `aria-current`.
  - The star rating has `role="img"` and a label.
  - The duplicated marquee copy is hidden from assistive technology.
- **The static export is clean:**
  - Sitemap and robots are `force-static`.
  - The 404 page carries `noindex`.
  - Every route has a canonical URL.
  - The client bundle contains no secrets.

### Recommended Actions
1. Fix H1 by passing the build year as a prop, and add a test with the clock set to next year.
2. Fix H2 by measuring the header height, and change the deep-link tests to assert "below the header".
3. Fix M1 and M2 together in `scroll.ts` (reduced motion plus an intent tagged with its pathname), with one test each.
4. Add the per-page Open Graph helper for M3, then re-check the `out/*.html` meta tags.
5. Then fix M4 (focus and announcements), M5 (fetch timeout) and M6 (preview-server hardening).
6. Fix the Low items as time allows.

### Metrics
- **Type coverage:** TypeScript strict mode; `tsc --noEmit` reported 0 errors.
- **Lint:** ESLint reported 0 errors and 0 warnings.
- **Tests:** the last recorded run passed. I did not re-run the suite, because it rebuilds `out/`. No test covers back/forward, reduced motion, the year change or header clearance on mobile.
- **Build:** not re-run, because it writes to `out/` and `.next`. The existing `out/` is newer than every source file, and I inspected it directly.

### Unresolved Questions
1. **Which host will serve the site?**
   - Next 16 writes `out/<route>/__next.*.txt` folders next to each `<route>.html`.
   - Some hosts redirect a folder to its URL with a slash before they try `.html`: Apache with `DirectorySlash`, S3 website endpoints, and possibly GitHub Pages, which `docs/deployment-guide.md` lists.
   - On those hosts `/about` could become `/about/` and then 404. A quick test of `/about` on the chosen host would settle this.
2. **Should the header stay sticky on phones?**
   - At 390 px the wrapped header is 169 px tall, about 20% of the screen, and it never scrolls away. In the prototype it did scroll away.
   - Is an always-sticky header on phones the intended product decision? H2 needs fixing either way.
3. **Is the marquee motion accepted as designed?** It loops forever with no pause control for visitors who have not turned on reduced motion (WCAG 2.2.2, Level A).
4. **Should the privacy policy mention Google Fonts?**
   - The policy says "no tracking pixels", but Material Symbols loads from Google's font servers, which see each visitor's IP address.
   - The options are to disclose this, or to self-host the 18 KB icon subset, which changes nothing visually.
