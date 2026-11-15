import { anchors, art, screens, screensLabel, sections } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { SectionHeading } from "./section-heading";

/** Real screens of the game in phone frames: a grid on wide screens, a row to swipe through on phones. */
export function ScreensSection() {
  return (
    <section id={anchors.screens} className={styles.section} aria-labelledby="screens-title">
      <div className={styles.inner}>
        <SectionHeading id="screens-title" {...sections.screens} />
        {/* Focusable so a keyboard can scroll the row where it scrolls; the role keeps list semantics in Safari. */}
        <ul className={styles.screens} tabIndex={0} role="list" aria-label={screensLabel}>
          {screens.map((screen) => (
            <li key={screen.file} className={styles.screen}>
              <figure className={styles.screenFigure}>
                <div className={styles.screenPhone}>
                  <img src={art(screen.file)} alt={screen.alt} width={585} height={1074} loading="lazy" decoding="async" />
                </div>
                <figcaption className={styles.screenCaption}>
                  <span className={styles.screenTitle}>{screen.title}</span>
                  <span className={styles.screenText}>{screen.text}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
