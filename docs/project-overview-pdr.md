# Project overview

## Purpose

dantech.app is the studio site of Dan Tech Indiv., Danh Tran's one-person software studio in Vietnam. It
presents the mobile apps and games (Duoly in Love, Kim Tài · Tick Vàng Online, 1010! Block Puzzle, Garage to AGI,
earlier indie games), the founder story and principles, support answers, legal pages, and two contact paths. It also
hosts the landing page of the game Garage to AGI at `/idle-ai-tycoon/`, which the game's store listings can use as their
website.

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
| Garage to AGI page | Done, built from the game's own pixel art. Out on Google Play since 2026-10-15; the page links the listing |
| Games on the home page | 1010! Block Puzzle (store buttons, no page of its own) and Garage to AGI (links its page), as cards and marquee items |
