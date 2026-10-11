import { earlierGames } from "@/content/products";
import { productAnchors } from "@/lib/routes";
import styles from "./products.module.css";

export function EarlierWorkSection() {
  return (
    <section id={productAnchors.earlier} className={`${styles.section} ${styles.alt}`}>
      <div className={styles.earlierInner}>
        <div className={styles.earlierHeading}>
          <h2 className={styles.earlierTitle}>
            Indie games that paid their own way — no team, no funding, just Unity and late nights.
          </h2>
        </div>
        <div className={styles.gameGrid}>
          {earlierGames.map((game) => (
            <div key={game.name} className={styles.game}>
              <img src={game.image} alt={game.alt} loading="lazy" className={styles.gameImage} />
              <div className={styles.gameBody}>
                <div className={styles.gameMeta}>{game.meta}</div>
                <div className={styles.gameName}>{game.name}</div>
                <div className={styles.gameText}>{game.text}</div>
                {game.award && <div className={styles.gameAward}>{game.award}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
