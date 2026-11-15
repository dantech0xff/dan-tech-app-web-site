import { anchors, faq, sections } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { SectionHeading } from "./section-heading";

/** Native disclosure widgets: every answer is in the HTML, and they open without a script. */
export function FaqSection() {
  return (
    <section id={anchors.faq} className={`${styles.section} ${styles.alt}`} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <SectionHeading id="faq-title" {...sections.faq} />
        <div className={styles.questions}>
          {faq.map((item, index) => (
            <details key={item.q} className={styles.question} open={index === 0}>
              <summary className={styles.questionTitle}>{item.q}</summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
