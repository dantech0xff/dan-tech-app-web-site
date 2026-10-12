import ui from "@/components/ui.module.css";
import { anchors, crew, hall, hiddenMinds, minds, sections, team, type Rarity } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { Sprite } from "./pixel-image";
import { SectionHeading } from "./section-heading";

const RARITY_CLASS: Record<Rarity, string> = {
  Common: styles.common,
  Rare: styles.rare,
  Epic: styles.epic,
  Legendary: styles.legendary,
};

export function CollectSection() {
  return (
    <section id={anchors.collect} className={`${styles.section} ${styles.alt}`} aria-labelledby="collect-title">
      <div className={styles.inner}>
        <SectionHeading id="collect-title" {...sections.collect} />

        <div className={`${styles.block} dt-reveal-60`}>
          <h3 className={styles.blockTitle}>{team.title}</h3>
          <p className={styles.note}>{team.text}</p>
          <ul className={styles.roster}>
            {crew.map((hire) => (
              <li key={hire.name} className={`${styles.hire} ${RARITY_CLASS[hire.rarity]}`}>
                <Sprite file={hire.sprite} className={styles.spriteLarge} />
                <span className={styles.hireName}>{hire.name}</span>
                <span className={styles.hireRole}>{hire.role}</span>
                <span className={styles.hireRarity}>{hire.rarity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.block} dt-reveal-60`}>
          <h3 className={styles.blockTitle}>{hall.title}</h3>
          <p className={styles.note}>{hall.text}</p>
          <ul className={styles.hall}>
            {minds.map((mind) => (
              <li key={mind.name} className={styles.mindCard}>
                <Sprite file={mind.sprite} className={styles.spriteLarge} />
                <span className={styles.mindName}>{mind.name}</span>
                <span className={styles.mindNote}>{mind.note}</span>
              </li>
            ))}
            {hiddenMinds.hints.map((hint) => (
              <li key={hint} className={`${styles.mindCard} ${styles.hidden}`}>
                <span className={styles.questionMark} aria-hidden="true">
                  ?
                </span>
                <span className={styles.mindName} aria-hidden="true">
                  ???
                </span>
                <span className={styles.srOnly}>{hiddenMinds.label}.</span>
                <span className={styles.mindNote}>{hint}</span>
              </li>
            ))}
          </ul>
          <div className={ui.tagRow}>
            {hall.keepsakes.map((keepsake) => (
              <span key={keepsake} className={ui.tag}>
                {keepsake}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
