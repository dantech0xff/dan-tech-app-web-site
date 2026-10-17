import { Icon } from "@/components/icon";
import { PhoneMockup } from "@/components/phone-mockup";
import { SiteLink } from "@/components/site-link";
import { StoreButton } from "@/components/store-button";
import ui from "@/components/ui.module.css";
import { art, game, heroScene } from "@/content/idle-ai-tycoon";
import { apps } from "@/content/products";
import { storeLinks } from "@/content/site";
import { productAnchors, routes } from "@/lib/routes";
import styles from "./home.module.css";

type Accent = "duoly" | "kimTai" | "blockPuzzle" | "garage";

type CardIntroProps = {
  icon: string;
  accent: Accent;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
};

type AppCardProps = CardIntroProps & {
  anchor: string;
  screen: string;
  screenAlt: string;
  statusInk: "dark" | "light";
};

const ACCENT_CLASSES: Record<Accent, { glow: string; shadow: string }> = {
  duoly: { glow: styles.glowDuoly, shadow: styles.shadowDuoly },
  kimTai: { glow: styles.glowKimTai, shadow: styles.shadowKimTai },
  blockPuzzle: { glow: styles.glowBlockPuzzle, shadow: styles.shadowBlockPuzzle },
  garage: { glow: styles.glowGarage, shadow: styles.shadowGarage },
};

const CARD_CLASS = `${styles.card} ${styles.appCard} dt-reveal-50`;

function LearnMore() {
  return (
    <div className={styles.learnMore}>
      Learn more <Icon name="arrow_forward" size={18} />
    </div>
  );
}

/** Glow, icon, eyebrow, name, description and tags: the part every card shares. */
function CardIntro({ icon, accent, eyebrow, title, description, tags }: CardIntroProps) {
  const accentClasses = ACCENT_CLASSES[accent];

  return (
    <>
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
    </>
  );
}

/** An app with a section on the products page: the whole card links there. */
function AppCard({ anchor, screen, screenAlt, statusInk, ...intro }: AppCardProps) {
  return (
    <SiteLink href={routes.products} anchor={anchor} className={CARD_CLASS}>
      <CardIntro {...intro} />
      <PhoneMockup size="card" statusInk={statusInk} screen={screen} alt={screenAlt} className={styles.cardPhone} />
      <LearnMore />
    </SiteLink>
  );
}

/** 1010! has no page on the site, so its card holds the store buttons instead of being a link. */
function BlockPuzzleCard() {
  return (
    <div className={CARD_CLASS}>
      <CardIntro
        icon={apps.blockPuzzle.icon}
        accent="blockPuzzle"
        eyebrow="03 · Puzzle game"
        title={apps.blockPuzzle.name}
        description="Drop blocks on a 10×10 board and clear full rows and columns. No timer, no color matching — just you and your best score."
        tags={["ANDROID", "iOS", "NO TIMER"]}
      />
      <PhoneMockup
        size="card"
        statusInk="light"
        screen="/assets/1010-screen-board.png"
        alt="1010! Block Puzzle — the 10×10 board"
        className={styles.cardPhone}
      />
      <div className={styles.cardStores}>
        <StoreButton store="googlePlay" href={storeLinks.blockPuzzleGooglePlay} />
        <StoreButton store="appStore" href={storeLinks.blockPuzzleAppStore} />
      </div>
    </div>
  );
}

/** The game's card: its words live with the page's, under the same rules (`src/content/idle-ai-tycoon.ts`). */
function GarageToAgiCard() {
  return (
    <SiteLink href={routes.idleAiTycoon} className={CARD_CLASS}>
      <CardIntro
        icon={game.icon.src}
        accent="garage"
        eyebrow={`04 · ${game.card.kind}`}
        title={game.titleLines.join(" ")}
        description={game.card.pitch}
        tags={[...game.card.tags]}
      />
      <div className={styles.gameWindow}>
        <img
          src={art(heroScene.file)}
          alt={game.card.sceneAlt}
          width={128}
          height={48}
          className={styles.gameScene}
          loading="lazy"
          decoding="async"
        />
        <span className={styles.gameChip} aria-hidden="true">
          {heroScene.chip}
        </span>
      </div>
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
        <BlockPuzzleCard />
        <GarageToAgiCard />
      </div>
    </section>
  );
}
