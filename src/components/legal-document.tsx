import type { ReactNode } from "react";
import styles from "./legal-document.module.css";

export type LegalClause = {
  title: string;
  body: ReactNode;
};

type LegalDocumentProps = {
  title: string;
  effective: string;
  clauses: LegalClause[];
  /** Cross-link line under the last clause. */
  seeAlso: ReactNode;
};

export function LegalDocument({ title, effective, clauses, seeAlso }: LegalDocumentProps) {
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
            <p className={styles.clauseText}>{clause.body}</p>
          </div>
        ))}
        <div className={styles.seeAlso}>{seeAlso}</div>
      </section>
    </main>
  );
}
