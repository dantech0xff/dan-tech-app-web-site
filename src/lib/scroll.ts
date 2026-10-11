import { isSamePath } from "./routes";

/** Desktop clearance: the one-row sticky header (69px) plus 3px, as in the design. */
const MIN_ANCHOR_OFFSET = 72;
const HEADER_GAP = 3;

type ScrollIntent = { pathname: string; anchor: string | null };

/** Where to scroll once a navigation started by a SiteLink commits. */
let pendingScroll: ScrollIntent | null = null;

export function setScrollIntent(pathname: string, anchor: string | null): void {
  pendingScroll = { pathname, anchor };
}

/**
 * Consumes the pending intent. Returns the anchor id (or `null` for the top of
 * the page) when it was recorded for `pathname`; `undefined` otherwise, e.g.
 * after back/forward, so the browser's own scroll restoration applies.
 */
export function takeScrollIntent(pathname: string): string | null | undefined {
  const intent = pendingScroll;
  pendingScroll = null;
  if (!intent || !isSamePath(intent.pathname, pathname)) return undefined;
  return intent.anchor;
}

/** Distance kept between the viewport top and a section; grows when the header wraps on phones. */
export function anchorOffset(): number {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  return Math.max(MIN_ANCHOR_OFFSET, header ? header.offsetHeight + HEADER_GAP : 0);
}

function motionSafe(behavior: ScrollBehavior): ScrollBehavior {
  return behavior === "smooth" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : behavior;
}

/**
 * Brings `anchor` just below the sticky header (smoothly unless the visitor
 * prefers reduced motion), or returns to the top with `topBehavior` when there
 * is no anchor or it is missing.
 */
export function scrollToSection(anchor: string | null, topBehavior: ScrollBehavior): void {
  const target = anchor ? document.getElementById(anchor) : null;
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - anchorOffset();
    window.scrollTo({ top, behavior: motionSafe("smooth") });
    return;
  }
  window.scrollTo({ top: 0, behavior: motionSafe(topBehavior) });
}
