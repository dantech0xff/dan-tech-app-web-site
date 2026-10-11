import { BrandLockup } from "./brand-lockup";
import { NavLinks } from "./nav-links";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header} data-site-header>
      <nav className={styles.nav} aria-label="Main">
        <BrandLockup placement="header" />
        <NavLinks />
      </nav>
    </header>
  );
}
