import { NewsletterForm } from "./newsletter-form";
import styles from "./home.module.css";

export function NewsletterSection() {
  return (
    <section className={styles.newsletter}>
      <div className={`${styles.newsletterCard} dt-reveal-60`}>
        <div className={styles.newsletterGlow} />
        <div className={styles.newsletterCopy}>
          <h2 className={styles.newsletterTitle}>One email when something ships. No weekly filler.</h2>
          <p className={styles.newsletterText}>
            New apps, major updates and the occasional course opening. Unsubscribe in one tap.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
