import { Icon } from "@/components/icon";
import { PhoneMockup } from "@/components/phone-mockup";
import { SiteLink } from "@/components/site-link";
import ui from "@/components/ui.module.css";
import { routes } from "@/lib/routes";
import styles from "./home.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <div className={styles.kickerRow}>
            <div className={`${styles.kickerDot} dt-pulse`} />
            <div className={styles.kicker}>Dan Tech Indiv. · one person, all the way through</div>
          </div>
          <h1 className={styles.heroTitle}>Apps make life more convenient.</h1>
          <p className={styles.heroLead}>
            A one-person studio from Vietnam. Every app designed, coded and shipped by the same pair of hands.
          </p>
          <div className={ui.buttonRow}>
            <SiteLink href={routes.products} className={`${ui.primaryButton} ${ui.lift}`}>
              Explore the products <Icon name="arrow_forward" size={20} />
            </SiteLink>
            <SiteLink href={routes.about} className={ui.secondaryButton}>
              Our story
            </SiteLink>
          </div>
          <div className={styles.heroProof}>10M+ downloads · 10+ products shipped · Android, iOS &amp; web</div>
        </div>

        <div className={styles.heroVisual}>
          <div className={`${styles.heroAppIcon} dt-float`}>
            <img src="/assets/duoly-icon.png" alt="Duoly in Love" width={256} height={256} />
          </div>
          <PhoneMockup
            size="regular"
            statusInk="dark"
            screen="/assets/duoly-screen-today.png"
            alt="Duoly in Love — Today"
            className={styles.heroPhoneBack}
            loading="eager"
          />
          <PhoneMockup
            size="regular"
            statusInk="light"
            screen="/assets/kimtai-screen-ledger.png"
            alt="Kim Tài — gold ledger"
            className={styles.heroPhoneFront}
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
