import type { ReactNode } from "react";
import styles from "./page-hero.module.css";

type PageHeroProps = {
  title: string;
  lead: ReactNode;
  /** Caps the headline at 900px (Products, About). */
  narrowTitle?: boolean;
  /** Lead paragraph measure: 620px by default, 640px on About. */
  wideLead?: boolean;
  /** Tighter bottom spacing when chips follow (Products). */
  compact?: boolean;
  children?: ReactNode;
};

/** Opening block of the inner pages: big headline, lead paragraph, optional extras. */
export function PageHero({ title, lead, narrowTitle = false, wideLead = false, compact = false, children }: PageHeroProps) {
  return (
    <section className={compact ? `${styles.hero} ${styles.compact}` : styles.hero}>
      <h1 className={narrowTitle ? `${styles.title} ${styles.narrowTitle}` : styles.title}>{title}</h1>
      <p className={wideLead ? `${styles.lead} ${styles.wideLead}` : styles.lead}>{lead}</p>
      {children}
    </section>
  );
}
