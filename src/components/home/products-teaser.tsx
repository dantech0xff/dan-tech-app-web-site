import { Icon } from "@/components/icon";
import { PhoneMockup } from "@/components/phone-mockup";
import { SiteLink } from "@/components/site-link";
import ui from "@/components/ui.module.css";
import { productAnchors, routes } from "@/lib/routes";
import styles from "./home.module.css";

type AppCardProps = {
  anchor: string;
  icon: string;
  accent: "duoly" | "kimTai";
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  screen: string;
  screenAlt: string;
  statusInk: "dark" | "light";
};

const ACCENT_CLASSES = {
  duoly: { glow: styles.glowDuoly, shadow: styles.shadowDuoly },
  kimTai: { glow: styles.glowKimTai, shadow: styles.shadowKimTai },
};

function LearnMore() {
  return (
    <div className={styles.learnMore}>
      Learn more <Icon name="arrow_forward" size={18} />
    </div>
  );
}

function AppCard({ anchor, icon, accent, eyebrow, title, description, tags, screen, screenAlt, statusInk }: AppCardProps) {
  const accentClasses = ACCENT_CLASSES[accent];

  return (
    <SiteLink
      href={routes.products}
      anchor={anchor}
      className={`${styles.card} ${styles.appCard} dt-reveal-50`}
    >
      <div className={`${styles.cardGlow} ${accentClasses.glow}`} />
      <div className={styles.cardTop}>
        <img src={icon} alt="" width={56} height={56} className={`${styles.cardIcon} ${accentClasses.shadow}`} />
        <div className={styles.cardEyebrow}>{eyebrow}</div>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{description}</p>
      <div className={ui.tagRow}>
        {tags.map((tag) => (
          <span key={tag} className={ui.tag}>
            {tag}
          </span>
        ))}
      </div>
      <PhoneMockup size="card" statusInk={statusInk} screen={screen} alt={screenAlt} className={styles.cardPhone} />
      <LearnMore />
    </SiteLink>
  );
}

export function ProductsTeaser() {
  return (
    <section className={styles.teaser}>
      <div className={`${styles.teaserHeader} dt-reveal-70`}>
        <div className={styles.teaserHeading}>
          <h2 className={styles.titleXl}>Different apps, one standard.</h2>
        </div>
        <SiteLink href={routes.products} className={`${ui.arrowLink} ${styles.nowrap}`}>
          All products &amp; stores <Icon name="arrow_forward" size={18} />
        </SiteLink>
      </div>

      <div className={styles.cardGrid}>
        <AppCard
          anchor={productAnchors.duoly}
          icon="/assets/duoly-icon.png"
          accent="duoly"
          eyebrow="01 · For couples"
          title="Duoly in Love"
          description="A private, gentle space for two: count your days, keep notes and photos, check in with a mood — and talk in a line only you two can see."
          tags={["ANDROID", "iOS", "5M+ · 4.6★"]}
          screen="/assets/duoly-screen-duo.png"
          screenAlt="Duoly in Love — Duo chat"
          statusInk="dark"
        />
        <AppCard
          anchor={productAnchors.kimTai}
          icon="/assets/kimtai-icon.png"
          accent="kimTai"
          eyebrow="02 · Personal finance"
          title="Kim Tài · Tick Vàng Online"
          description="A personal gold book: record what you hold, follow reference prices from DOJI, PNJ and more, and see what it is worth — all on your device."
          tags={["ANDROID", "iOS", "LOCAL-FIRST"]}
          screen="/assets/kimtai-screen-ledger.png"
          screenAlt="Kim Tài — gold ledger"
          statusInk="light"
        />
      </div>
    </section>
  );
}
