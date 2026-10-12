import type { SectionCopy } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";

type SectionHeadingProps = SectionCopy & {
  /** Id of the h2, referenced by the section's `aria-labelledby`. */
  id: string;
};

/** Eyebrow, headline and lead that open each section of the page. */
export function SectionHeading({ id, eyebrow, title, lead }: SectionHeadingProps) {
  return (
    <header className={`${styles.heading} dt-reveal-70`}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <h2 id={id} className={styles.h2}>
        {title}
      </h2>
      <p className={styles.lead}>{lead}</p>
    </header>
  );
}
