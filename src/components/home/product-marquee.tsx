import { marqueeItems } from "@/content/home";
import styles from "./home.module.css";

/** Endless strip of product marks; the second copy makes the loop seamless. */
export function ProductMarquee() {
  return (
    <section className={styles.marquee}>
      <div className={`${styles.marqueeTrack} dt-marquee`}>
        {[false, true].map((isCopy) => (
          <div key={String(isCopy)} className={styles.marqueeGroup} aria-hidden={isCopy || undefined}>
            {marqueeItems.map((item) => (
              <div key={item.label} className={styles.marqueeItem}>
                <img
                  src={item.icon}
                  alt=""
                  width={32}
                  height={32}
                  className={item.cover ? `${styles.marqueeIcon} ${styles.cover}` : styles.marqueeIcon}
                />
                <span className={styles.marqueeLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
