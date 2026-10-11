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

## Hosting

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
