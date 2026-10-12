import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SiteLink } from "@/components/site-link";
import ui from "@/components/ui.module.css";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbs } from "@/lib/structured-data";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Dan Tech Indiv. is an independent software studio from Vietnam. One founder designs, builds, ships and supports every product.",
  path: routes.about,
});

const STATEMENTS = [
  {
    title: "Build apps that make people's lives more convenient — and more successful.",
    text: "Convenience is what the user feels on day one. Success is what they look back on after a year of use.",
  },
  {
    title: "A Vietnamese indie studio whose apps feel inevitable.",
    text: "Small, honest, used every day.",
  },
];

const RULES = [
  {
    title: "One job per app",
    text: "If a feature does not serve the one job, it does not ship. Less on screen, more in use.",
  },
  {
    title: "Honest premium",
    text: "Free keeps the core. Premium adds depth. Prices, renewals and restores are plain to read — no guilt, no countdowns.",
  },
  {
    title: "Nothing simulated",
    text: "No fake messages, presence or read receipts. If the app shows it, it happened.",
  },
  {
    title: "Finish what you start",
    text: "Design, code, store listing, support — the same person owns the whole loop, so nothing is lost in a hand-off.",
  },
];

const TOOLS = [
  "Kotlin",
  "Jetpack Compose",
  "Kotlin Multiplatform",
  "Flutter",
  "SwiftUI",
  "Unity",
  "Next.js",
  "Supabase",
  "AI-assisted development",
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs(routes.about)} />
      <PageHero
        narrowTitle
        wideLead
        title="One person, all the way through."
        lead="Dan Tech Indiv. is an independent software studio from Vietnam. One founder designs, builds, ships and supports every product."
      />

      <section className={styles.statements}>
        {STATEMENTS.map((statement) => (
          <div key={statement.title} className={`${styles.statement} dt-reveal-50`}>
            <div className={styles.statementTitle}>{statement.title}</div>
            <div className={styles.statementText}>{statement.text}</div>
          </div>
        ))}
      </section>

      <section className={styles.rules}>
        <div className={`${styles.rulesHeading} dt-reveal-70`}>
          <h2 className={styles.rulesTitle}>Four rules, applied to every screen.</h2>
        </div>
        <div className={styles.ruleGrid}>
          {RULES.map((rule, index) => (
            <div key={rule.title} className={`${styles.rule} dt-reveal-50`}>
              <div className={styles.ruleNumber}>{String(index + 1).padStart(2, "0")}</div>
              <div className={styles.ruleTitle}>{rule.title}</div>
              <div className={styles.ruleText}>{rule.text}</div>
            </div>
          ))}
        </div>
        <div className={`${styles.stack} dt-reveal-60`}>
          <div className={styles.stackLabel}>BUILT WITH</div>
          {TOOLS.map((tool) => (
            <span key={tool} className={styles.stackItem}>
              {tool}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.ctaCard} dt-reveal-60`}>
          <div className={styles.ctaCopy}>
            <div className={styles.ctaTitle}>Want to build something together?</div>
            <div className={styles.ctaText}>Partnerships, press and hiring all start with one email.</div>
          </div>
          <div className={ui.buttonRow}>
            <SiteLink href={routes.contact} className={ui.primaryButton}>
              Contact Dan <Icon name="arrow_forward" size={20} />
            </SiteLink>
          </div>
        </div>
      </section>
    </main>
  );
}
