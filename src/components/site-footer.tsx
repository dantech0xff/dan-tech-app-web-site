import { BrandLockup } from "./brand-lockup";
import { CurrentYear } from "./current-year";
import { SiteLink } from "./site-link";
import { productAnchors, routes } from "@/lib/routes";
import { site, social } from "@/content/site";
import styles from "./site-footer.module.css";

const FOOTER_SOCIAL = [social.github, social.x, social.facebook, social.linkedin, social.telegram, social.youtube];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.brandColumn}>
          <BrandLockup placement="footer" />
          <div className={styles.tagline}>
            Apps that make life more convenient — and more successful. Built end-to-end by one person in Vietnam.
          </div>
          <a href={`mailto:${site.email}`} className={styles.email}>
            {site.email}
          </a>
        </div>

        <div className={styles.column}>
          <div className={styles.heading}>Products</div>
          <SiteLink href={routes.products} anchor={productAnchors.duoly} className={styles.link}>
            Duoly in Love
          </SiteLink>
          <SiteLink href={routes.products} anchor={productAnchors.kimTai} className={styles.link}>
            Kim Tài · Tick Vàng Online
          </SiteLink>
          <SiteLink href={routes.products} anchor={productAnchors.academy} className={styles.link}>
            Dan Tech Academy
          </SiteLink>
          <SiteLink href={routes.products} anchor={productAnchors.earlier} className={styles.link}>
            Earlier work
          </SiteLink>
        </div>

        <div className={styles.column}>
          <div className={styles.heading}>Company</div>
          <SiteLink href={routes.about} className={styles.link}>
            About
          </SiteLink>
          <SiteLink href={routes.faq} className={styles.link}>
            FAQ &amp; support
          </SiteLink>
          <SiteLink href={routes.contact} className={styles.link}>
            Contact
          </SiteLink>
          <a href={site.academyUrl} target="_blank" rel="noopener" className={styles.link}>
            dantech.academy ↗
          </a>
        </div>

        <div className={styles.column}>
          <div className={styles.heading}>Legal &amp; social</div>
          <SiteLink href={routes.privacy} className={styles.link}>
            Privacy Policy
          </SiteLink>
          <SiteLink href={routes.terms} className={styles.link}>
            Terms of Service
          </SiteLink>
          <div className={styles.socialRow}>
            {FOOTER_SOCIAL.map((channel) => (
              <a key={channel.name} href={channel.href} target="_blank" rel="noopener" className={styles.socialChip}>
                {channel.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>
          © <CurrentYear buildYear={new Date().getFullYear()} /> Dan Tech Indiv. All rights reserved.
        </span>
        <span>Made in Vietnam · one person, all the way through</span>
      </div>
    </footer>
  );
}
