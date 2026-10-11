---
title: dantech.app live on Dokploy behind Cloudflare
date: 2026-10-11
summary: "Dokploy app via API with a browser Access session, Cloudflare and Namecheap via Claude in Chrome, Origin CA from a local CSR; Traefik loaded the certificate only after a domain re-save."
---

# dantech.app live on Dokploy behind Cloudflare

## What happened

- The user declined to mint Cloudflare API tokens or an Access service token. The Dokploy API was driven with the user's API key plus the session of `cloudflared access login` (sent as `cf-access-token`). Cloudflare and Namecheap were changed through Claude in Chrome after the user approved an explicit list of changes.
- Dokploy (v0.30.8): project and application `dantech-app` (Swarm service `dantech-app-xuhkc4`), GitHub App source on `main` with the push trigger, Dockerfile build, Swarm update start-first with rollback. The first deploy took 48 s. Domains `dantech.app` and `www.dantech.app` on port 8080 with certificate None, plus a permanent www → apex redirect.
- Cloudflare's quick scan had imported the Namecheap Private Email CNAMEs (`mail`, `autodiscover`, `autoconfig`) as Proxied. That would have broken IMAP/SMTP as soon as the zone went active; they are DNS only now. A pending zone answers without its proxy, so `dig` against the Cloudflare nameservers cannot reveal proxy status before activation: the dashboard is the only check.
- Origin CA refused to issue while the zone was pending ("Failed to validate requested hostname"). After the nameserver switch at Namecheap the `.app` registry updated within about 30 s, and the zone went active about 2 min after "Check nameservers now".
- `certificates.create` on this Dokploy requires `organizationId` (taken from the project). The script's OpenAPI contract check stopped before sending anything.
- After Dokploy stored the certificate, Traefik kept serving `TRAEFIK DEFAULT CERT` for `dantech.app`. Saving the `dantech.app` domain unchanged made Dokploy rewrite the app's Traefik file, and Traefik then served the Origin certificate. Traefik's fallback is its own default certificate: the `*.dantech.academy` Origin certificate is matched by SNI, it is not a store default as earlier notes assumed.
- The Chrome extension masks base64 in JavaScript results, so the public certificate came over through the page's copy button and `pbpaste`.

## Decision

- Origin CA certificate (ECDSA P-256, valid until 2041-10-07) issued from a CSR made locally. The private key never appeared on screen or in output, went to Dokploy through its API, and the local copy was deleted.
- Same edge settings as dantech.academy: SSL/TLS Full (strict) and Always Use HTTPS.
- Verified: origin TLS and routes via SNI, public site through Cloudflare (200, 301 slash and www redirects, 404), mail records DNS only, GitHub webhook path open through Access while the rest of the API stays behind it.

## Next steps

- The user verifies the registrant contacts at Namecheap (ICANN 15-day rule), otherwise the domain is suspended.
- Revoke the Dokploy API key used for the setup and delete `.env.deploy`.
- The next push to `main` is the first end-to-end proof of autodeploy.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
