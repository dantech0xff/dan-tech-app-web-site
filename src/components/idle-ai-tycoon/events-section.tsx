import { anchors, events, eventsIntro } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { PixelImage } from "./pixel-image";
import { SectionHeading } from "./section-heading";

export function EventsSection() {
  return (
    <section id={anchors.events} className={styles.section} aria-labelledby="events-title">
      <div className={styles.inner}>
        <SectionHeading id="events-title" eyebrow="Weekend events" title="A new event every weekend.">
          {eventsIntro}
        </SectionHeading>

        <ul className={styles.events}>
          {events.map((event) => (
            <li key={event.title} className={`${styles.event} dt-reveal-50`}>
              <figure className={styles.eventBanner}>
                <PixelImage file={event.banner} width={128} height={40} alt={event.alt} />
              </figure>
              <div className={styles.eventBody}>
                <div className={styles.cardLabel}>{event.label}</div>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <p className={styles.cardText}>{event.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
