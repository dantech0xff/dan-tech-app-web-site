import type { ReactNode } from "react";
import styles from "./game.module.css";

type SectionHeadingProps = {
  /** Id of the h2, referenced by the section's `aria-labelledby`. */
  id: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

/** Eyebrow, headline and optional lead that open each section of the page. */
export function SectionHeading({ id, eyebrow, title, children }: SectionHeadingProps) {
  return (
    <header className={`${styles.heading} dt-reveal-70`}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <h2 id={id} className={styles.h2}>
        {title}
      </h2>
      {children && <p className={styles.lead}>{children}</p>}
    </header>
  );
}
