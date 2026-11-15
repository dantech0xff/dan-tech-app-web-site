import { StoreButton } from "@/components/store-button";
import { anchors, game, sections } from "@/content/idle-ai-tycoon";
import { storeLinks } from "@/content/site";
import styles from "./game.module.css";
import { GooglePlayQr } from "./google-play-qr";
import { PixelImage } from "./pixel-image";

/** The page's closing call to install, before the studio newsletter. */
export function DownloadSection() {
  const { eyebrow, title, lead } = sections.download;

  return (
    <section id={anchors.download} className={`${styles.section} ${styles.download}`} aria-labelledby="download-title">
      <PixelImage file="scene-garage.png" width={128} height={48} className={styles.downloadScene} />
      <div className={`${styles.inner} ${styles.downloadInner}`}>
        <img className={styles.downloadIcon} src={game.iconFull} alt="" width={512} height={512} loading="lazy" decoding="async" />
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h2 id="download-title" className={styles.downloadTitle}>
          {title}
        </h2>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.statusRow}>
          <span className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            {game.status}
          </span>
        </div>
        <StoreButton store="googlePlay" href={storeLinks.garageToAgiGooglePlay} />
        <GooglePlayQr large />
      </div>
    </section>
  );
}
