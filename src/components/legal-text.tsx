import type { Block, Inline } from "@/lib/legal-markdown";
import { parseLegalText } from "@/lib/legal-markdown";
import styles from "./legal-document.module.css";

function InlineText({ parts }: { parts: Inline[] }) {
  return parts.map((part, index) => {
    switch (part.kind) {
      case "strong":
        return <strong key={index}>{part.text}</strong>;
      case "code":
        return <code key={index}>{part.text}</code>;
      case "url":
        return (
          <a key={index} href={part.text} target="_blank" rel="noopener">
            {part.text}
          </a>
        );
      case "email":
        return (
          <a key={index} href={`mailto:${part.text}`}>
            {part.text}
          </a>
        );
      default:
        return part.text;
    }
  });
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => {
    if (block.kind === "paragraph") {
      return (
        <p key={index} className={styles.clauseText}>
          <InlineText parts={block.content} />
        </p>
      );
    }
    if (block.kind === "list") {
      return (
        <ul key={index} className={styles.list}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {/* A one-paragraph item is written inline; a longer one keeps its paragraphs and nested lists. */}
              {item.length === 1 && item[0].kind === "paragraph" ? <InlineText parts={item[0].content} /> : <Blocks blocks={item} />}
            </li>
          ))}
        </ul>
      );
    }
    return (
      // Scrolls on its own on a phone, so the page never does.
      <div key={index} className={styles.tableWrap} tabIndex={0} role="region" aria-label="Table">
        <table className={styles.table}>
          <thead>
            <tr>
              {block.head.map((cell, cellIndex) => (
                <th key={cellIndex} scope="col">
                  <InlineText parts={cell} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    <InlineText parts={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
}

const LAST_UPDATED = /^Last updated: (.+)$/;

/**
 * A complete legal text written in the game repo's Markdown (see lib/legal-markdown.ts), as its own part of a legal
 * page: an h2 title, the date line as meta, then numbered h3 sections exactly as the source numbers them.
 */
export function LegalText({ id, source }: { id: string; source: string }) {
  const { title, preamble, sections } = parseLegalText(source);
  const first = preamble[0];
  const dateLine = first?.kind === "paragraph" && first.content.length === 1 ? LAST_UPDATED.exec(first.content[0].text) : null;
  const intro = dateLine ? preamble.slice(1) : preamble;

  return (
    <section id={id} className={styles.part} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.partTitle}>
        {title}
      </h2>
      {dateLine && (
        <div className={styles.meta}>
          <span>Last updated {dateLine[1]}</span>
        </div>
      )}
      <Blocks blocks={intro} />
      {sections.map((section, index) => (
        <div key={section.title} className={index === sections.length - 1 ? `${styles.clause} ${styles.last}` : styles.clause}>
          <h3 className={styles.clauseTitle}>{section.title}</h3>
          <Blocks blocks={section.blocks} />
        </div>
      ))}
    </section>
  );
}
