import { studioStats } from "@/content/home";
import styles from "./home.module.css";

export function StudioStats() {
  return (
    <section className={styles.stats}>
      <div className={`${styles.statsGrid} dt-reveal-60`}>
        {studioStats.map((stat) => (
          <div key={stat.value} className={stat.accent ? `${styles.stat} ${styles.accent}` : styles.stat}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
