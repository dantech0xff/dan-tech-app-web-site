"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { site } from "@/content/site";
import { contactMailto } from "@/lib/mailto";
import styles from "./contact-form.module.css";

const TOPICS = [
  { value: "Partnership", label: "Partnership / collaboration" },
  { value: "Press", label: "Press / media" },
  { value: "Support", label: "App support" },
  { value: "Hiring", label: "Hiring / freelance" },
  { value: "Other", label: "Something else" },
];

/** Composes the message in the visitor's own mail app; there is no server-side inbox. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const sentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const returningToForm = useRef(false);

  // Swapping form and confirmation removes the focused button; move focus to
  // the new content so keyboard and screen-reader users keep their place.
  useEffect(() => {
    if (sent) {
      sentRef.current?.focus();
    } else if (returningToForm.current) {
      returningToForm.current = false;
      nameRef.current?.focus();
    }
  }, [sent]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    window.location.href = contactMailto({
      name: field("name"),
      email: field("email"),
      topic: field("topic"),
      message: field("message"),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div ref={sentRef} tabIndex={-1} className={styles.sent} role="status">
        <Icon name="mark_email_read" size={36} className={styles.sentIcon} />
        <div className={styles.sentTitle}>Your mail app should be open with the message ready.</div>
        <div className={styles.sentText}>
          If it did not open, write directly to <a href={`mailto:${site.email}`}>{site.email}</a>. Replies take 2–3
          working days.
        </div>
        <button
          type="button"
          className={styles.again}
          onClick={() => {
            returningToForm.current = true;
            setSent(false);
          }}
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.label}>
          NAME
          <input
            ref={nameRef}
            name="name"
            type="text"
            required
            placeholder="Your name"
            autoComplete="name"
            className={styles.field}
          />
        </label>
        <label className={styles.label}>
          EMAIL
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className={styles.field}
          />
        </label>
      </div>
      <label className={styles.label}>
        TOPIC
        <select name="topic" className={styles.select}>
          {TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        MESSAGE
        <textarea
          name="message"
          required
          rows={6}
          placeholder="What are you building, or what do you need?"
          className={styles.textarea}
        />
      </label>
      <div className={styles.footer}>
        <div className={styles.hint}>Opens your mail app with the message prefilled.</div>
        <button type="submit" className={styles.submit}>
          Send message <Icon name="send" size={20} />
        </button>
      </div>
    </form>
  );
}
