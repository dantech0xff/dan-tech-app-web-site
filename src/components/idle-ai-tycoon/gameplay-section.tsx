import { anchors, loops, products, rounds, roundsText } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { Sprite } from "./pixel-image";
import { SectionHeading } from "./section-heading";

export function GameplaySection() {
  return (
    <section id={anchors.gameplay} className={styles.section} aria-labelledby="gameplay-title">
      <div className={styles.inner}>
        <SectionHeading id="gameplay-title" eyebrow="How it plays" title="Four loops, one number.">
          Tap, train, hire, sell. Every loop ends by multiplying what your products earn, so there is always a next move.
        </SectionHeading>

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
          <h3 className={styles.blockTitle}>Ten products in the Garage Era. Ten new ones in every world after it.</h3>
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
          <h3 className={styles.blockTitle}>Funding rounds open the game up.</h3>
          <ol className={styles.rounds}>
            {rounds.map((round, index) => (
              <li key={round} className={index === rounds.length - 1 ? `${styles.round} ${styles.top}` : styles.round}>
                {round}
              </li>
            ))}
          </ol>
          <p className={styles.note}>{roundsText}</p>
        </div>
      </div>
    </section>
  );
}
