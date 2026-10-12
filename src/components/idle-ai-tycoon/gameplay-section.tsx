import { anchors, loops, products, productsTitle, rounds, sections } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { Sprite } from "./pixel-image";
import { SectionHeading } from "./section-heading";

export function GameplaySection() {
  return (
    <section id={anchors.gameplay} className={styles.section} aria-labelledby="gameplay-title">
      <div className={styles.inner}>
        <SectionHeading id="gameplay-title" {...sections.gameplay} />

        <ol className={styles.loops}>
          {loops.map((loop) => (
            <li key={loop.title} className={`${styles.loop} dt-reveal-50`}>
              <div className={styles.loopTop}>
                <span className={styles.loopNumber}>{loop.number}</span>
                <Sprite file={loop.icon} />
              </div>
              <h3 className={styles.cardTitle}>{loop.title}</h3>
              <p className={styles.cardText}>{loop.text}</p>
            </li>
          ))}
        </ol>

        <div className={`${styles.block} dt-reveal-60`}>
          <h3 className={styles.blockTitle}>{productsTitle}</h3>
          <ul className={styles.products}>
            {products.map((product) => (
              <li key={product.name} className={styles.product}>
                <Sprite file={product.sprite} />
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productTagline}>{product.tagline}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.block} dt-reveal-60`}>
          <h3 className={styles.blockTitle}>{rounds.title}</h3>
          <ol className={styles.rounds}>
            {rounds.names.map((round, index) => (
              <li key={round} className={index === rounds.names.length - 1 ? `${styles.round} ${styles.top}` : styles.round}>
                {round}
              </li>
            ))}
          </ol>
          <p className={styles.note}>{rounds.text}</p>
        </div>
      </div>
    </section>
  );
}
