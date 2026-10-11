"use client";

import { usePathname } from "next/navigation";
import { SiteLink } from "./site-link";
import { isSamePath, routes, type SitePath } from "@/lib/routes";
import styles from "./site-header.module.css";

const NAV_ITEMS: { label: string; href: SitePath }[] = [
  { label: "Products", href: routes.products },
  { label: "About", href: routes.about },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className={styles.links}>
      {NAV_ITEMS.map(({ label, href }) => {
        const active = isSamePath(pathname, href);
        return (
          <SiteLink key={href} href={href} className={styles.link} aria-current={active ? "page" : undefined}>
            {label}
            {active && <span className={styles.activeDot} aria-hidden="true" />}
          </SiteLink>
        );
      })}
      <SiteLink href={routes.products} className={styles.cta}>
        Get the apps
      </SiteLink>
    </div>
  );
}
