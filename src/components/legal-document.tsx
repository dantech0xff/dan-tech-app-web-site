import type { ReactNode } from "react";
import styles from "./legal-document.module.css";

export type LegalClause = {
  title: string;
  /** One paragraph, or several in order. */
  body: ReactNode | ReactNode[];
};

type LegalDocumentProps = {
  title: string;
  effective: string;
  clauses: LegalClause[];
  /** A complete text of its own after the clauses, such as one app's full policy. */
  appendix?: ReactNode;
  /** Cross-link line at the end. */
  seeAlso: ReactNode;
};

export function LegalDocument({ title, effective, clauses, appendix, seeAlso }: LegalDocumentProps) {
  const lastIndex = clauses.length - 1;

  return (
    <main>
      <section className={styles.document}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          <span>Effective {effective}</span>
          <span>Applies to dantech.app and the apps published by Dan Tech Indiv.</span>
        </div>
        {clauses.map((clause, index) => (
          <div key={clause.title} className={index === lastIndex ? `${styles.clause} ${styles.last}` : styles.clause}>
            {/* One text node, so glyph shaping matches the design exactly. */}
            <h2 className={styles.clauseTitle}>{`${index + 1}. ${clause.title}`}</h2>
            {(Array.isArray(clause.body) ? clause.body : [clause.body]).map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className={styles.clauseText}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
        {appendix}
        <div className={styles.seeAlso}>{seeAlso}</div>
      </section>
    </main>
  );
}
