"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { isSamePath, type SitePath } from "@/lib/routes";
import { scrollToSection, setScrollIntent } from "@/lib/scroll";

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href" | "scroll" | "onNavigate"> & {
  href: SitePath;
  /** Element id on the target page to bring into view below the sticky header. */
  anchor?: string;
};

/**
 * Internal link with the site's scroll behaviour: another page opens at its
 * top (or glides to `anchor`), while a link to the current page smooth-scrolls
 * in place instead of reloading it.
 */
export function SiteLink({ href, anchor, ...rest }: SiteLinkProps) {
  const pathname = usePathname();
  const target = anchor ? `${href}#${anchor}` : href;

  return (
    <Link
      {...rest}
      href={target}
      scroll={false}
      onNavigate={(event) => {
        if (isSamePath(pathname, href)) {
          event.preventDefault();
          window.history.replaceState(window.history.state, "", target);
          scrollToSection(anchor ?? null, "smooth");
          return;
        }
        setScrollIntent(href, anchor ?? null);
      }}
    />
  );
}
