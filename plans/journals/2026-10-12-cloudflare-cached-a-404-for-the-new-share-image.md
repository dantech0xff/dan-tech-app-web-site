---
title: Cloudflare cached a 404 for the new share image
date: 2026-10-12
summary: "A deploy check that polled a new file's URL left a cached 404 at the edge for about 3 minutes; nginx now sends no-store with every 404."
---

# Cloudflare cached a 404 for the new share image

## What happened

- Right after the share cards were pushed, the owner opened `https://dantech.app/assets/share/site.jpg` and got "not found", although the new container had the file.
- The cause was the deploy check itself: a wait loop requested that URL every 5 seconds while the old container was still serving, got its 404 page, and Cloudflare cached the 404. It does this for static file types for about 3 minutes by default, on several edge servers at different times, and it passed `cache-control: max-age=14400` on to browsers, which may keep the 404 for 4 hours.
- A request with a throwaway query string (`?x=1`) went to the origin and returned the right 200 image (114,912 bytes, 1200x630, byte-identical to the commit), which showed that only the edge copy was wrong. The copies expired on their own at 22:03:43, and twelve requests over IPv4 and IPv6 then all returned the image.
- The fix is in `nginx.conf`: the 404 page is sent with `Cache-Control: no-store`, so neither a CDN nor a browser stores a miss. The production nginx image showed it for assets, `_next/static`, `/fonts/`, unknown pages and `/404.html`, while 200 responses and the immutable caching of `/fonts/` stayed as they were. The local preview server sends the same header and a test checks it.

## Decision

- Never cache a 404, at the origin rather than with a CDN rule, because the cost is nothing and the failure (a new file stuck as "not found") was real.
- To check a deploy, poll an HTML page (not cached) for something new in it, then fetch a new file once. The deployment guide says so.

## Next steps

- After this deploy, a request for a file that does not exist should show `cache-control: no-store` and no edge caching.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
