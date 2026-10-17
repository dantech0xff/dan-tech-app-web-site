import { marqueeItems } from "@/content/home";
import styles from "./home.module.css";

/** The list repeats inside each group so one group (about 4,400 px) is wider than the screen. */
const REPEATS = 3;
const GROUP_ITEMS = Array.from({ length: REPEATS }, () => marqueeItems).flat();
/** Scrolls one group at the design's pace, about 44 px/s (the design's 1,740 px group took 40 s); retune it with the list. */
const DURATION = "100s";

/** Endless strip of product marks; the second copy makes the loop seamless. */
export function ProductMarquee() {
  return (
    <section className={styles.marquee}>
      <div className={`${styles.marqueeTrack} dt-marquee`} style={{ animationDuration: DURATION }}>
        {[false, true].map((isCopy) => (
          <div key={String(isCopy)} className={styles.marqueeGroup} aria-hidden={isCopy || undefined}>
            {GROUP_ITEMS.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className={styles.marqueeItem}
                aria-hidden={index >= marqueeItems.length || undefined}
              >
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
