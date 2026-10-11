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

const ACADEMY_STATS = [
  { value: "81", label: "Bilingual posts", green: false },
  { value: "119+", label: "Course lessons", green: false },
  { value: "1M", label: "Devs — the goal", green: true },
];

function AcademyCard() {
  return (
    <SiteLink
      href={routes.products}
      anchor={productAnchors.academy}
      className={`${styles.card} ${styles.academyCard} dt-reveal-50`}
    >
      <div className={styles.academyGlow} />
      <div className={styles.academyCopy}>
        <div className={styles.cardTop}>
          <img
            src="/assets/academy-logo.png"
            alt=""
            width={56}
            height={56}
            className={`${styles.cardIcon} ${styles.shadowAcademy}`}
          />
          <div className={styles.cardEyebrow}>03 · Learning</div>
        </div>
        <h3 className={styles.cardTitle}>Dan Tech Academy</h3>
        <p className={styles.cardText}>
          Where Vietnamese developers learn to ship a real mobile app with AI — bilingual articles, the Mobile Action
          Pro and Kotlin Accelerator courses, taught by someone who ships.
        </p>
        <div className={ui.tagRow}>
          <span className={ui.tag}>WEB</span>
          <span className={ui.tag}>VI · EN</span>
          <span className={ui.tag}>DANTECH.ACADEMY</span>
        </div>
        <LearnMore />
      </div>
      <div className={styles.academyStats}>
        {ACADEMY_STATS.map((stat) => (
          <div key={stat.label} className={styles.academyStat}>
            <div className={stat.green ? `${styles.academyStatValue} ${styles.green}` : styles.academyStatValue}>
              {stat.value}
            </div>
            <div className={styles.academyStatLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </SiteLink>
  );
}

export function ProductsTeaser() {
  return (
    <section className={styles.teaser}>
      <div className={`${styles.teaserHeader} dt-reveal-70`}>
        <div className={styles.teaserHeading}>
          <h2 className={styles.titleXl}>Three products, one standard.</h2>
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
        <AcademyCard />
      </div>
    </section>
  );
}
