import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { SiteLink } from "@/components/site-link";
import { site, social } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Partnerships, press, support or hiring. One inbox, read by the person who built the apps.",
  path: routes.contact,
});

const CHANNELS = [social.telegram, social.facebook, social.linkedin, social.github, social.x, social.youtube];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        title="Talk to Dan."
        lead="Partnerships, press, support or hiring. One inbox, read by the person who built the apps. Replies within 2–3 working days."
      >
        <a href={`mailto:${site.email}`} className={styles.emailLink}>
          {site.email} <Icon name="arrow_outward" size={28} />
        </a>
      </PageHero>

      <section className={styles.layout}>
        <ContactForm />
        <div className={styles.aside}>
          <div className={styles.channels}>
            {CHANNELS.map((channel) => (
              <a key={channel.name} href={channel.href} target="_blank" rel="noopener" className={styles.channel}>
                <span className={styles.channelName}>{channel.name}</span>
                <span className={styles.channelHandle}>{channel.handle}</span>
              </a>
            ))}
          </div>
          <div className={styles.help}>
            <div className={styles.helpText}>
              For account deletion, restores and bugs, include the app name, your device and the store you bought from.
              Common answers are in the <SiteLink href={routes.faq}>FAQ</SiteLink>.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
