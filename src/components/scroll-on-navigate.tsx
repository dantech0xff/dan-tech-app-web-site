"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { anchorOffset, scrollToSection, takeScrollIntent } from "@/lib/scroll";

function elementFromHash(): HTMLElement | null {
  const id = window.location.hash.slice(1);
  if (!id) return null;
  try {
    return document.getElementById(decodeURIComponent(id));
  } catch {
    return null;
  }
}

/**
 * Keeps section anchors clear of the sticky header and applies the scroll
 * intent recorded by SiteLink once the new page has rendered.
 */
export function ScrollOnNavigate() {
  const pathname = usePathname();

  // The header grows when its links wrap on narrow screens: publish the
  // clearance for CSS (scroll-padding) and re-align a section opened by URL hash.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;
    const sync = () => document.documentElement.style.setProperty("--anchor-offset", `${anchorOffset()}px`);
    sync();

    const target = elementFromHash();
    const offset = anchorOffset();
    if (target && Math.abs(target.getBoundingClientRect().top - offset) > 1) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset });
    }

    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const anchor = takeScrollIntent(pathname);
      if (anchor !== undefined) scrollToSection(anchor, "auto");
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
