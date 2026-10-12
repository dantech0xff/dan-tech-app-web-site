import { Icon } from "@/components/icon";
import { SiteLink } from "@/components/site-link";
import ui from "@/components/ui.module.css";
import { anchors, game, heroScene } from "@/content/idle-ai-tycoon";
import { routes } from "@/lib/routes";
import styles from "./game.module.css";
import { PixelImage } from "./pixel-image";

export function GameHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>{game.kicker}</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine}>Garage to</span> <span className={`${styles.titleLine} ${styles.agi}`}>AGI</span>
          </h1>
          <p className={styles.heroLead}>{game.lead}</p>
          <div className={styles.statusRow}>
            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              {game.status}
            </span>
            <span className={styles.statusNote}>{game.statusNote}</span>
          </div>
          <div className={ui.buttonRow}>
            <SiteLink href={routes.idleAiTycoon} anchor={anchors.gameplay} className={`${ui.secondaryButton} ${ui.lift}`}>
              See how it plays <Icon name="arrow_forward" size={20} className={styles.jumpIcon} />
            </SiteLink>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={`${styles.heroIcon} dt-float`}>
            <img src={game.icon.src} alt={game.icon.alt} width={game.icon.width} height={game.icon.height} />
          </div>
          <div className={styles.window}>
            <div className={styles.windowScene}>
              <PixelImage file={heroScene.file} width={128} height={48} alt={heroScene.alt} eager />
              <span className={styles.windowChip} aria-hidden="true">
                {heroScene.chip}
              </span>
            </div>
            {/* An echo of the game's Model tab, for atmosphere. */}
            <div className={styles.hud} aria-hidden="true">
              <div className={styles.hudRow}>
                <PixelImage file="icon-gpu.png" width={16} height={16} eager />
                <span>{game.hud.label}</span>
                <span className={styles.hudValue}>{game.hud.value}</span>
              </div>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${game.hud.percent}%` }} />
              </div>
              <div className={styles.hudMeta}>{game.hud.meta}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
