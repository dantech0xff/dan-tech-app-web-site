# Deployment guide

The site is a static export: `npm run build` writes everything to `out/`. No Node.js server is needed in
production, and the site makes no third-party requests (all fonts are self-hosted).

## Build

```bash
npm ci
NEXT_PUBLIC_NEWSLETTER_ENDPOINT=https://… npm run build   # endpoint optional
```

With `trailingSlash: true`, `out/` holds one folder per route (`about/index.html`, `products/index.html`, …)
plus `index.html`, `404.html`, `sitemap.xml`, `robots.txt`, icons, `assets/`, `fonts/` and hashed
`_next/static/` bundles. Canonical URLs end with a slash (`https://dantech.app/about/`).

## Production: Dokploy, deploy on push to `main`

Production (`https://dantech.app`) runs on the self-hosted Dokploy at `deploy.dantech.academy` behind Cloudflare,
like the owner's other apps. The repository `dantech0xff/dan-tech-app-web-site` (private) ships a `Dockerfile`: a
Node 22 stage runs `npm ci` and `npm run build`, then `nginxinc/nginx-unprivileged:1.30-alpine` serves `out/` on
port 8080 with `nginx.conf` (relative slash redirects, `404.html` with status 404 and `Cache-Control: no-store`, UTF-8 charset on text files such as `llms.txt`, gzip, immutable caching for
`/_next/static/` and `/fonts/`) and a `HEALTHCHECK`.

A push to `main` reaches Dokploy through its GitHub App webhook (`https://deploy.dantech.academy/api/deploy/github`,
which Cloudflare Access lets through; Dokploy checks the signature itself). Dokploy builds the image on the VPS
(the first build took under a minute) and Swarm starts the new container before it stops the old one. A failed build
or an unhealthy container leaves the running site untouched. If a push does not deploy, the GitHub App's Recent
Deliveries show whether the webhook reached Dokploy.

Every push to `main` goes to production and no CI runs the tests: run `npm run lint`, `npm run typecheck` and
`npm test` before pushing.

### Current setup (2026-10-11)

| Piece | Setting |
| --- | --- |
| Dokploy application | Project `dantech-app` → environment `production` → application `dantech-app` (Swarm service `dantech-app-xuhkc4`). |
| Source | GitHub App provider `Dokploy-2026-10-01-g7i5b9`, repository `dantech0xff/dan-tech-app-web-site`, branch `main`, build path `/`, trigger On Push, Autodeploy on, no watch paths. |
| Build | Build type Dockerfile: file `Dockerfile`, context `.`. No environment variables; add the build argument `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` once a newsletter endpoint exists. |
| Swarm update | `{ "Parallelism": 1, "Delay": 10000000000, "FailureAction": "rollback", "Order": "start-first" }`. No published ports: Traefik is the only way in. |
| Traefik | Domains `dantech.app` and `www.dantech.app`: path `/`, container port 8080, HTTPS on, certificate None. Permanent redirect `^https?://www\.dantech\.app/(.*)` → `https://dantech.app/${1}`. |
| Origin certificate | Cloudflare Origin CA certificate for `dantech.app` and `*.dantech.app` (ECDSA P-256, valid until 2041-10-07), in Dokploy → Certificates as `dantech.app Cloudflare Origin`. Traefik picks certificates by SNI; the one for `*.dantech.academy` does not cover this domain. |
| Cloudflare | Zone `dantech.app` (Free plan); Namecheap points the domain to `galilea.ns.cloudflare.com` and `noel.ns.cloudflare.com`. SSL/TLS Full (strict), Always Use HTTPS on; the edge certificate is Cloudflare's Universal SSL. |
| DNS | `A dantech.app` → the VPS and `CNAME www` → `dantech.app`, both proxied. Email stays on Namecheap Private Email (`admin@dantech.app`) with every record DNS only: `MX` `mx1.privateemail.com` and `mx2.privateemail.com` (priority 10), `TXT` `v=spf1 include:spf.privateemail.com ~all`, `CNAME` `mail`, `autodiscover` and `autoconfig` → `privateemail.com`, `SRV _autodiscover._tcp` → `0 0 443 privateemail.com`. |

Keep in mind:

- Keep the mail records DNS only and leave Cloudflare Email Routing off; either change breaks `admin@dantech.app`.
- Cloudflare caches a 404 for a static file for about 3 minutes (and used to pass `max-age=14400` on to browsers), so
  a new file requested just before its deploy finished stayed "not found" after it existed. `nginx.conf` now sends
  `Cache-Control: no-store` with every 404, so a 404 is never cached. To check a deploy anyway, poll an HTML page (not
  cached) for something new in it and fetch the new file once afterwards; a 404 already cached expires by itself, or
  can be purged by URL in Cloudflare (Caching, Configuration, Purge Cache, Custom Purge).
- Cloudflare error 526 means Traefik answered without the `dantech.app` certificate. Traefik did not load the
  certificate Dokploy stored until the `dantech.app` domain was saved again (unchanged) in Dokploy, which rewrites
  the app's Traefik file; do the same after adding or replacing a certificate.
- Cloudflare issues Origin CA certificates only for an active zone. The current one expires on 2041-10-07.
- The domain's "Redirect Domain" entry at Namecheap no longer applies, since Namecheap no longer serves its DNS.

To rebuild the setup, recreate the rows above in this order: GitHub App access to the repository, the application
with its source, build type and Swarm settings, a first deploy, the two domains and the redirect, the Cloudflare
zone and its records (mail records DNS only), the nameservers at the registrar, and once the zone is active the
Origin certificate in Dokploy followed by the domain save that reloads Traefik.

## Other hosts

Any host that serves `index.html` for a folder URL and uses `404.html` for misses works; `/about` redirects to
`/about/` the usual way.

| Host | Setup |
| --- | --- |
| Vercel | Import the repository; framework preset Next.js. |
| Cloudflare Pages | Build command `npm run build`, output directory `out`. |
| Netlify | Build command `npm run build`, publish directory `out`. |
| GitHub Pages | Publish `out/` with an empty `out/.nojekyll` added (otherwise Pages hides `_next/`). Use the custom domain at the root so no `basePath` is needed. |
| Nginx | `root /var/www/out; location / { try_files $uri $uri/ =404; } error_page 404 /404.html;` |

Cache `/_next/static/*` and `/fonts/*` long-term (immutable); keep HTML short-lived so new builds appear at once.

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
