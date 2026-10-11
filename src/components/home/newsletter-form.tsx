"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { SiteLink } from "@/components/site-link";
import { routes } from "@/lib/routes";
import { subscribeToShipNotes, type SubscribeOutcome } from "@/lib/newsletter";
import { site } from "@/content/site";
import styles from "./newsletter-form.module.css";

type Status = "idle" | "sending" | "error" | SubscribeOutcome;

const CONFIRMATION: Record<SubscribeOutcome, string> = {
  subscribed: "Thanks — you are on the list. Next note goes out when something ships.",
  "mail-app": "Your mail app should be open with the request ready — send it and you are on the list.",
};

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const confirmationRef = useRef<HTMLDivElement>(null);
  const done = status === "subscribed" || status === "mail-app";

  // The focused Subscribe button disappears; hand focus to the confirmation so
  // keyboard and screen-reader users land on the result.
  useEffect(() => {
    if (done) confirmationRef.current?.focus();
  }, [done]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setStatus("sending");
    try {
      setStatus(await subscribeToShipNotes(email));
    } catch {
      setStatus("error");
    }
  }

  if (done) {
    return (
      <div ref={confirmationRef} tabIndex={-1} className={styles.confirmation} role="status">
        <Icon name="check_circle" size={22} className={styles.confirmationIcon} />
        {CONFIRMATION[status]}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        aria-label="Email address"
        autoComplete="email"
        className={styles.input}
      />
      <button type="submit" className={styles.submit} disabled={status === "sending"}>
        Subscribe
      </button>
      {status === "error" && (
        <div className={styles.error} role="alert">
          Could not subscribe right now. Try again, or write to {site.email}.
        </div>
      )}
      <div className={styles.note}>
        Your address is used for these notes only. See the <SiteLink href={routes.privacy}>privacy policy</SiteLink>.
      </div>
    </form>
  );
}
