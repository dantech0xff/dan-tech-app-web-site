import { Icon } from "@/components/icon";
import { SiteLink } from "@/components/site-link";
import ui from "@/components/ui.module.css";
import { routes } from "@/lib/routes";
import styles from "./home.module.css";

/** 3×3 dot matrix; the centre dot is the "one person" and pulses. */
const DOTS = Array.from({ length: 9 }, (_, index) => index === 4);

export function FounderSection() {
  return (
    <section className={styles.founder}>
      <div className={`${styles.founderArtWrap} dt-reveal-60`}>
        <div className={styles.founderArt}>
          <div className={styles.dotGrid}>
            {DOTS.map((live, index) => (
              <div key={index} className={live ? `${styles.dot} ${styles.live} dt-pulse` : styles.dot} />
            ))}
          </div>
          <div className={styles.founderMark}>
            <div className={styles.founderWordmark}>dan tech</div>
            <div className={styles.founderTagRow}>
              <div className={styles.founderTagDot} />
              <div className={styles.founderTag}>indiv. · one person, all the way through</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.founderCopy} dt-reveal-60`}>
        <h2 className={styles.titleLg}>Fourteen years of code. Ten of them professional. All of it toward this.</h2>
        <p className={styles.founderText}>
          Danh Tran wrote his first line of code in 2012 and turned professional in 2015. The decade in between and
          after ran through Zalo and ShopBack — code on 100 million devices, five billion messages a day — alongside a
          string of indie games that paid their own way. In 2026 he went independent to build Dan Tech: mobile apps
          that serve people&apos;s everyday lives.
        </p>
        <blockquote className={styles.quote}>
          “I spent five years finding out how a mobile app earns its keep, and five more learning what is worth
          building.”
        </blockquote>
        <SiteLink href={routes.about} className={ui.arrowLink}>
          Read the full story <Icon name="arrow_forward" size={18} />
        </SiteLink>
      </div>
    </section>
  );
}
