"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { DEFAULT_OPEN_FAQ, faqGroups } from "@/content/faq";
import styles from "./faq-list.module.css";

/** Grouped accordion; at most one answer is open at a time. */
export function FaqList() {
  const [openKey, setOpenKey] = useState<string | null>(DEFAULT_OPEN_FAQ);

  return (
    <section className={styles.groups}>
      {faqGroups.map((group) => (
        <div key={group.key} className={styles.group}>
          <div className={styles.groupName}>{group.name}</div>
          <div className={styles.items}>
            {group.items.map((item, index) => {
              const key = `${group.key}${index}`;
              const open = openKey === key;
              const answerId = `faq-${key}`;
              return (
                <div key={key} className={styles.item}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={open}
                    aria-controls={open ? answerId : undefined}
                    onClick={() => setOpenKey(open ? null : key)}
                  >
                    <span>{item.q}</span>
                    <Icon name={open ? "remove" : "add"} size={22} className={styles.toggleIcon} />
                  </button>
                  {open && (
                    <div id={answerId} className={styles.answer}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
            <div className={styles.itemsEnd} />
          </div>
        </div>
      ))}
    </section>
  );
}
