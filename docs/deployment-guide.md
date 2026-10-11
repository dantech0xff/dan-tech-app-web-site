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

Production runs on the self-hosted Dokploy at `deploy.dantech.academy`, like the owner's other apps. The repository
`dantech0xff/dan-tech-app-web-site` (private) ships a `Dockerfile`: a Node 22 stage runs `npm ci` and
`npm run build`, then `nginxinc/nginx-unprivileged:1.30-alpine` serves `out/` on port 8080 with `nginx.conf`
(relative slash redirects, `404.html` with status 404, gzip, immutable caching for `/_next/static/` and `/fonts/`)
and a `HEALTHCHECK`. The image was built and the full Playwright suite passed against it (2026-10-11).

What a push to `main` does once the steps below are done: GitHub sends the push event to the Dokploy GitHub App
webhook (`https://deploy.dantech.academy/api/deploy/github`, already exempt from Cloudflare Access), Dokploy
builds the image on the VPS and Swarm swaps the container. A failed build leaves the running site untouched.

One-time setup (manual; the Dokploy API credentials and the Access service token were deleted on 2026-10-04):

1. **GitHub App access.** GitHub → Settings → Applications → Installed GitHub Apps → the Dokploy app →
   Configure → Repository access: include `dan-tech-app-web-site` (nothing to do if it has all repositories).
2. **Application.** In Dokploy create a project (for example `dantech-app`) and an Application `dantech-app`.
   - General → Provider **GitHub**: the Dokploy GitHub App provider, repository `dan-tech-app-web-site`, branch
     `main`, build path `/`, trigger **On Push**; save and keep **Autodeploy** on. Leave Watch Paths empty.
   - Build Type **Dockerfile**: file `Dockerfile`, context `.`.
   - Build Arguments (optional): `NEXT_PUBLIC_NEWSLETTER_ENDPOINT=…` once a newsletter endpoint exists. The
     Environment tab is not needed: the container reads no variables.
   - Advanced → Swarm Settings → Update Config, for zero-downtime swaps of this stateless site:
     `{ "Parallelism": 1, "Delay": 10000000000, "FailureAction": "rollback", "Order": "start-first" }`.
3. **Domain.** `dantech.app` still uses Namecheap's default DNS and a parking page. Pick one:
   - *Like the other sites (Cloudflare):* add the zone to Cloudflare and switch the nameservers at Namecheap;
     proxied A records for `dantech.app` and `www` to the VPS. Traefik's default certificate is the Origin CA
     for `*.dantech.academy`, which does not cover `dantech.app`: create a Cloudflare Origin certificate for
     `dantech.app, *.dantech.app` and add it under Dokploy → Certificates. Dokploy domain: host `dantech.app`,
     path `/`, container port `8080`, HTTPS on, certificate **None**.
   - *Without Cloudflare:* at Namecheap point an A record for `@` to the VPS and a CNAME `www` to `dantech.app`,
     removing the parking records. Dokploy domain as above with certificate **Let's Encrypt** (needs the
     `letsencrypt` resolver still defined in `traefik.yml` and port 80 reachable).

   Add `www.dantech.app` too, with a permanent redirect on the application: regex
   `^https?://www\.dantech\.app/(.*)`, replacement `https://dantech.app/${1}`.
4. **First deploy.** Press Deploy once, then check `https://dantech.app/` (200), `/about` (301 to `/about/`) and
   `/no-such-page` (404). From then on every push to `main` deploys; if one does not, the GitHub App's Recent
   Deliveries show whether the webhook reached Dokploy.

Every push to `main` goes to production and no CI runs the tests: run `npm run lint`, `npm run typecheck` and
`npm test` before pushing.

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
