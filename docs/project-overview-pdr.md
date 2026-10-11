# Project overview

## Purpose

dantech.app is the studio site of Dan Tech Indiv., Danh Tran's one-person software studio in Vietnam. It
presents the mobile apps (Duoly in Love, Kim Tài · Tick Vàng Online, earlier indie games),
the founder story and principles, support answers, legal pages, and two contact paths.

## Requirements

- Match the Claude Design project "Dan Tech Landing Page Design" visually and in copy, at desktop, tablet and
  phone widths.
- Real, shareable URLs per page; deep links to each product section.
- Works as a static site on any host; no server-side state.
- Contact goes through the visitor's mail client to admin@dantech.app (no server inbox).
- Newsletter sign-up posts to a configurable endpoint; without one it falls back to a prefilled email.
- Respect reduced-motion preferences; keyboard and screen-reader friendly controls.

## Non-goals

CMS, analytics, accounts, localisation and any backend beyond the newsletter endpoint hook.

## Status

| Area | State |
| --- | --- |
| Pages, navigation, interactions | Done, covered by Playwright tests |
| Visual parity with the design | Verified by screenshot, text and computed-style comparison |
| App screen images | Rebuilt from the design's partial files plus the App Store screenshots; replace with the design project's originals when available (see design-guidelines.md, Assets) |
| Newsletter provider | Endpoint not chosen yet; mailto fallback active |
