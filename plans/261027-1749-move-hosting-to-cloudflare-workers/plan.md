# Move dantech.app from Dokploy to Cloudflare Workers

Status: done (2026-10-27) · Created 2026-10-27

## Outcome
dantech.app is served by a Cloudflare Worker with static assets (the owner's Workers Paid plan) instead of the Dokploy
container on the VPS, which can then be removed to free its memory. A push to `main` still deploys the site.

## Decisions (owner, 2026-10-27)
- Cloudflare Workers, not Vercel: Vercel's Hobby plan is for non-commercial use only, and this site advertises the
  studio's apps.
- Deploy on push to `main` through Workers Builds (the owner connects the GitHub repository in the dashboard once).
- No API tokens minted by hand: Wrangler signs in through the browser; dashboard steps are done by the owner.

## What the host must keep doing (from `nginx.conf`)
| Behaviour | On Workers |
| --- | --- |
| `/about` → `/about/` with 301 | `public/_redirects`, one 301 per route (the built-in trailing-slash handling uses 307) |
| Folder URL serves `index.html`; misses get `404.html` with status 404 | `html_handling: auto-trailing-slash`, `not_found_handling: 404-page` |
| Immutable caching of `/_next/static/` and `/fonts/` | `public/_headers` |
| A 404 is never cached | Built in: a 404 goes out with `public, max-age=0, must-revalidate` |
| UTF-8 charset on text files (`llms.txt`) | `_headers` for the three root text files: the live Worker sends a bare `text/plain` (`wrangler dev` adds the charset, production does not) |
| `app-ads.txt` as plain text, no redirect | Checked on the live Worker |
| `www.dantech.app` → `https://dantech.app/…` (Traefik today) | Cloudflare Redirect Rule (owner) |

## Phases
1. [x] Repo: `wrangler.jsonc` (assets-only Worker, no route yet), `public/_redirects`, `public/_headers`, Wrangler as a
   dev dependency, `.node-version`, a unit test that keeps `_redirects` in step with the routes.
2. [x] First deploy to `workers.dev` with `wrangler login` + `wrangler deploy`; check every behaviour above there.
3. [x] Owner: connect the repository in Workers Builds (build `npm run build`, deploy `npx wrangler deploy`).
4. [x] Cutover: owner adds the www Redirect Rule; the Worker takes `dantech.app/*` through a route in `wrangler.jsonc`
   (instant, and removing the route rolls back to the VPS). Check the live site.
5. [x] After a quiet period: owner points `A dantech.app` at the placeholder `192.0.2.0` (proxied) and deletes the
   Dokploy application; the repo drops `Dockerfile` and `nginx.conf`; docs follow.

## Notes
- Next.js went from 16.4.0 to 16.4.3 first (owner, 2026-10-27): 16.4.0 had three advisories and `next build` stopped on
  some runs to ask for the upgrade, which would have made Workers Builds fail at random.
- Wrangler was already signed in through the browser (OAuth, account "Dan Tran"); the Worker is `dantech-app`, first
  deployed to `https://dantech-app.dan-tran.workers.dev`.
- New deploys reach every edge within about a minute; checks made right after a deploy can hit the old version.
- Cutover 2026-10-27 (commit `e56da7b`): deployed by hand with the route first, then the push ran the first Workers
  Builds build (GitHub check "Workers Builds: dantech-app", success). Every row above checked on `https://dantech.app`
  and the whole Playwright suite passed against it. The www redirect now comes from Cloudflare (body "cloudflare"),
  not Traefik. `workers_dev` and `preview_urls` are off, so the site exists on dantech.app only.
- Found after the cutover: Cloudflare's Email Address Obfuscation does not apply to Worker responses, so
  `admin@dantech.app` is now plain text in the pages. `src/lib/llms.ts`, `src/lib/structured-data.ts` and the README
  still say the host hides it; the owner decides whether the site hides it itself or the comments change.
- Docs rewritten for the Worker on 2026-10-27 (`docs/deployment-guide.md`, README, codebase summary, design
  guidelines); the Dokploy section stays as the rollback until phase 5.

## Rollback
None since phase 5 (2026-10-27): the owner retired the Dokploy app the same day.
