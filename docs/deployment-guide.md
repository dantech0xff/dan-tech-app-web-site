# Deployment guide

The site is a static export: `npm run build` writes everything to `out/`. No Node.js server is needed in
production, and the site makes no third-party requests (all fonts are self-hosted).

## Build

```bash
npm ci
NEXT_PUBLIC_NEWSLETTER_ENDPOINT=https://… npm run build   # endpoint optional
```

With `trailingSlash: true`, `out/` holds one folder per route (`about/index.html`, `products/index.html`, …)
plus `index.html`, `404.html`, `sitemap.xml`, `robots.txt`, `app-ads.txt`, icons, `assets/`, `fonts/` and hashed
`_next/static/` bundles. Canonical URLs end with a slash (`https://dantech.app/about/`).

## Production: Cloudflare Worker, deploy on push to `main`

Since 2026-10-27, production (`https://dantech.app`) is the Cloudflare Worker `dantech-app`, described by
`wrangler.jsonc`. It has no script: every request is answered from the files in `out/`. A push to `main` starts
Workers Builds, Cloudflare's Git integration, which installs the dependencies, runs `npm run build`, then
`npx wrangler deploy`, with Node 24 from `.node-version`. The new version reaches every Cloudflare location within
about a minute. A failed build never reaches the deploy step, so the live version stays as it was. Each build shows
on its commit in GitHub as the check "Workers Builds: dantech-app", and its log is in the dashboard (Workers & Pages →
`dantech-app` → Deployments → View build history).

Every push to `main` goes to production and no CI runs the tests: run `npm run lint`, `npm run typecheck` and
`npm test` before pushing.

To deploy by hand (Workers Builds down, or trying a change to `wrangler.jsonc`), sign Wrangler in through the browser
once with `npx wrangler login`, then run:

```bash
npm run build && npx wrangler deploy
```

### What the host does, and where it is set

| Behaviour | Set by |
| --- | --- |
| A folder URL serves its `index.html`; `/about/index.html` redirects to `/about/` (307). | `html_handling: "auto-trailing-slash"` in `wrangler.jsonc` |
| `/about` redirects to `/about/` with a 301 (the Worker alone would answer 307). | `public/_redirects`, one line per route in `src/lib/routes.ts`; `tests/hosting.unit.spec.ts` keeps them in step |
| A miss gets `404.html` with status 404 and `Cache-Control: public, max-age=0, must-revalidate`, so neither a browser nor Cloudflare answers from a stored miss. | `not_found_handling: "404-page"` in `wrangler.jsonc` |
| `/_next/static/*` and `/fonts/*` are cached for a year as immutable; everything else is revalidated on every visit. | `public/_headers` |
| `llms.txt`, `robots.txt` and `app-ads.txt` go out as `text/plain; charset=utf-8`. The Worker alone sends a bare `text/plain`, and a browser would misread the accented letters in `llms.txt`. | `public/_headers` |
| Responses are compressed (Brotli or gzip). | Cloudflare, by itself |
| `www.dantech.app/…` redirects to `https://dantech.app/…` with a 301, query string kept. | A Cloudflare Redirect Rule, which runs before the Worker |

`npm run build` copies `_redirects` and `_headers` into `out/`; Cloudflare reads them at deploy and never serves them.

### Current setup (2026-10-27)

| Piece | Setting |
| --- | --- |
| Worker | `dantech-app` on the owner's Cloudflare account (Workers Paid plan). Route `dantech.app/*` on zone `dantech.app`. `workers.dev` and preview URLs are off, so the site exists on `dantech.app` only. |
| Workers Builds | Repository `dantech0xff/dan-tech-app-web-site` (private), branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`, root directory `/` (Settings → Build). No build variables; add `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` under "Build variables and secrets" once a newsletter endpoint exists (runtime variables never reach the build). |
| Redirect Rule | Zone `dantech.app` → Rules → "www to root": wildcard pattern `https://www.dantech.app/*` → `https://dantech.app/${1}`, status 301, Preserve query string on. |
| Cloudflare | Zone `dantech.app` (Free plan); Namecheap points the domain to `galilea.ns.cloudflare.com` and `noel.ns.cloudflare.com`. SSL/TLS Full (strict), Always Use HTTPS on; the edge certificate is Cloudflare's Universal SSL. |
| DNS | `A dantech.app` → the old VPS (never reached while the route exists) and `CNAME www` → `dantech.app`, both proxied: the route and the Redirect Rule only see proxied traffic. Email stays on Namecheap Private Email (`admin@dantech.app`) with every record DNS only: `MX` `mx1.privateemail.com` and `mx2.privateemail.com` (priority 10), `TXT` `v=spf1 include:spf.privateemail.com ~all`, `CNAME` `mail`, `autodiscover` and `autoconfig` → `privateemail.com`, `SRV _autodiscover._tcp` → `0 0 443 privateemail.com`. |

Keep in mind:

- Keep the mail records DNS only and leave Cloudflare Email Routing off; either change breaks `admin@dantech.app`.
- To check a deploy, poll an HTML page for something new in it and fetch a new file once afterwards. For about a
  minute after a deploy, some locations still serve the previous version.
- Cloudflare's Email Address Obfuscation does not apply to what a Worker sends, so since the move `admin@dantech.app`
  appears as plain text in the pages; the Dokploy host's pages had it hidden.
- The domain's "Redirect Domain" entry at Namecheap no longer applies, since Namecheap no longer serves its DNS.

To rebuild the setup: a first `npx wrangler deploy` creates the Worker and its route from `wrangler.jsonc`; then
connect the repository in Workers Builds with the settings above, add the Redirect Rule, and keep the zone's records
as listed (mail records DNS only, a proxied record for `dantech.app`).

### The old Dokploy host (rollback until it is removed)

Until 2026-10-27 the site ran on the self-hosted Dokploy at `deploy.dantech.academy`: `Dockerfile` builds the export
and serves it with unprivileged nginx (`nginx.conf`) on port 8080. That application (project `dantech-app` →
environment `production` → application `dantech-app`, Swarm service `dantech-app-xuhkc4`, GitHub App provider
`Dokploy-2026-10-01-g7i5b9`) still runs and still rebuilds on every push, but gets no traffic. Its Traefik serves both
domains with the Cloudflare Origin CA certificate stored in Dokploy as `dantech.app Cloudflare Origin` (valid until
2041-10-07).

To roll back, remove the route in the dashboard (Workers & Pages → `dantech-app` → Settings → Domains & Routes):
`dantech.app` goes back to the VPS at once, and `www` keeps its redirect. Remove `routes` from `wrangler.jsonc` as
well, or the next push adds the route back.

To retire it: point `A dantech.app` at the placeholder `192.0.2.0` (still proxied), delete the Dokploy application
(and its project once empty) and the certificate, and take this repository out of the Dokploy GitHub App's repository
list (the App itself stays for the owner's other apps). Then delete `Dockerfile`, `.dockerignore` and `nginx.conf`
and this section.

## Other hosts

Any host that serves `index.html` for a folder URL and uses `404.html` for misses works; `/about` redirects to
`/about/` the usual way. Cloudflare Pages and Netlify also read `public/_redirects` and `public/_headers` as they are.

| Host | Setup |
| --- | --- |
| Vercel | Import the repository; framework preset Next.js. |
| Cloudflare Pages | Build command `npm run build`, output directory `out`. |
| Netlify | Build command `npm run build`, publish directory `out`. |
| GitHub Pages | Publish `out/` with an empty `out/.nojekyll` added (otherwise Pages hides `_next/`). Use the custom domain at the root so no `basePath` is needed. |
| Nginx | `root /var/www/out; location / { try_files $uri $uri/ =404; } error_page 404 /404.html;` |

Cache `/_next/static/*` and `/fonts/*` long-term (immutable); keep HTML short-lived so new builds appear at once.

## app-ads.txt

`public/app-ads.txt` is served at `https://dantech.app/app-ads.txt` as plain text, with no redirect: that is where
Google AdMob looks, starting from the developer website in each app's store listing (Google Play: the store listing's
website; App Store: the marketing URL). After a deploy, AdMob (Apps, app-ads.txt) can take up to a day to report the file
as found. If it still reports it missing after that, check that no Cloudflare rule (bot fight mode, a WAF or Access rule)
challenges or blocks that URL.

## Domain and metadata

Canonical URLs, Open Graph URLs, `sitemap.xml` and `robots.txt` use `https://dantech.app`
(`site.url` in `src/content/site.ts`). Change it there if the site moves.

## Newsletter endpoint

`NEXT_PUBLIC_NEWSLETTER_ENDPOINT` receives `POST` with `Content-Type: application/json` and body
`{ "email": "<address>" }`; any 2xx response within 10 seconds shows the "you are on the list" confirmation,
anything else an inline error. The endpoint must allow CORS from the site's origin. Without the variable,
Subscribe opens a prefilled email to admin@dantech.app instead.

## Preview locally

```bash
npm run build && npm run start   # http://127.0.0.1:4311
```

`scripts/serve-static.mjs` mimics a production host: folder URLs redirect to the trailing-slash form,
`index.html` is served for folders, and misses return `404.html` with status 404. It listens on localhost only.

To try the Worker itself, rule files included, `npx wrangler dev` serves `out/` on http://localhost:8787. It is close
to production but not the same: it adds a charset to text files that the deployed Worker leaves out.
