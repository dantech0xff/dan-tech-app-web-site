import { anchors, eras, glitches, sections, simulation, type EraMind } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { PixelImage, Sprite } from "./pixel-image";
import { SectionHeading } from "./section-heading";

/** The mind that wakes up when an era's last model ships. */
function MindLine({ mind }: { mind: EraMind }) {
  return (
    <div className={styles.mind}>
      <Sprite file={mind.sprite} className={styles.spriteSmall} />
      <div className={styles.mindText}>
        <span className={styles.mindTitle}>{mind.name}</span>
        <span className={styles.mindLine}>{mind.line}</span>
      </div>
    </div>
  );
}

export function WorldsSection() {
  return (
    <section id={anchors.worlds} className={`${styles.section} ${styles.alt}`} aria-labelledby="worlds-title">
      <div className={styles.inner}>
        <SectionHeading id="worlds-title" {...sections.worlds} />

        <div className={styles.eras}>
          {eras.map((era) => (
            <article key={era.id} className={`${styles.era} dt-reveal-50`}>
              <figure className={styles.eraScene}>
                <PixelImage file={era.scene} width={128} height={48} alt={era.alt} />
              </figure>
              <div className={styles.eraBody}>
                <div className={styles.eraMeta}>
                  <span className={styles.eraLabel}>{era.label}</span>
                  <span className={styles.rule}>{era.rule}</span>
                </div>
                <h3 className={styles.cardTitle}>{era.title}</h3>
                <p className={styles.cardText}>{era.text}</p>
                <MindLine mind={era.mind} />
              </div>
            </article>
          ))}

          <article className={`${styles.era} ${styles.simulation} dt-reveal-50`}>
            <figure className={styles.eraScene}>
              <PixelImage file={simulation.scene} width={128} height={48} alt={simulation.alt} />
            </figure>
            <div className={styles.eraBody}>
              <div className={styles.eraMeta}>
                <span className={styles.eraLabel}>{simulation.label}</span>
                <span className={styles.rule}>{simulation.rule}</span>
              </div>
              <h3 className={styles.cardTitle}>{simulation.title}</h3>
              <p className={styles.cardText}>{simulation.text}</p>
              <ul className={styles.glitches}>
                {glitches.map((glitch) => (
                  <li key={glitch.name} className={styles.glitch}>
                    <span className={styles.glitchName}>{glitch.name}</span>
                    <span className={styles.glitchText}>{glitch.text}</span>
                  </li>
                ))}
              </ul>
              <MindLine mind={simulation.mind} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
