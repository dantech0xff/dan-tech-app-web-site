import { agiMoment, anchors, away, founder, lossSpike, sections, surprises, viralPosts } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";
import { PixelImage, Sprite } from "./pixel-image";
import { SectionHeading } from "./section-heading";

/**
 * The training-incident dialog, rebuilt from the game's own screen. It is a picture, not a control: the label gives
 * assistive tech the same words and numbers the picture shows.
 */
function LossSpikeDialog() {
  const { dialog } = lossSpike;
  const label = `${dialog.title} ${dialog.sub}. ${dialog.rollBack.title}: ${dialog.rollBack.sub}. ${dialog.pushThrough.title}: ${dialog.pushThrough.sub}.`;

  return (
    <div className={styles.featureStage} role="img" aria-label={label}>
      <div className={styles.dialog}>
        <div className={styles.dialogHead}>
          <PixelImage file="icon-warn.png" width={16} height={16} />
          <div>
            <div className={styles.dialogTitle}>{dialog.title}</div>
            <div className={styles.dialogSub}>{dialog.sub}</div>
          </div>
        </div>
        <div className={styles.dialogBody}>{dialog.body}</div>
        <div className={`${styles.dialogButton} ${styles.rollBack}`}>
          <strong>{dialog.rollBack.title}</strong>
          <span>{dialog.rollBack.sub}</span>
        </div>
        <div className={`${styles.dialogButton} ${styles.pushThrough}`}>
          <strong>{dialog.pushThrough.title}</strong>
          <span>{dialog.pushThrough.sub}</span>
        </div>
      </div>
    </div>
  );
}

export function MomentsSection() {
  return (
    <section id={anchors.moments} className={styles.section} aria-labelledby="moments-title">
      <div className={styles.inner}>
        <SectionHeading id="moments-title" {...sections.moments} />

        <div className={styles.stack}>
          <div className={`${styles.feature} dt-reveal-50`}>
            <div className={styles.featureCopy}>
              <div className={styles.cardLabel}>{lossSpike.label}</div>
              <h3 className={styles.featureTitle}>{lossSpike.title}</h3>
              <p className={styles.featureText}>{lossSpike.text}</p>
            </div>
            <LossSpikeDialog />
          </div>

          <div className={`${styles.feature} ${styles.flip} dt-reveal-50`}>
            <div className={styles.featureCopy}>
              <div className={styles.cardLabel}>{agiMoment.label}</div>
              <h3 className={styles.featureTitle}>{agiMoment.title}</h3>
              <p className={styles.featureText}>{agiMoment.text}</p>
              <figure className={styles.paper}>
                <figcaption className={styles.paperSource}>{agiMoment.source}</figcaption>
                <blockquote className={styles.paperText}>{agiMoment.headline}</blockquote>
              </figure>
            </div>
            <div className={`${styles.featureStage} ${styles.flush}`}>
              <PixelImage file={agiMoment.scene} width={128} height={64} alt={agiMoment.alt} className={styles.fill} />
            </div>
          </div>

          <div className={styles.minis}>
            <article className={`${styles.mini} dt-reveal-50`}>
              <div className={styles.miniSprites}>
                {surprises.sprites.map((file) => (
                  <Sprite key={file} file={file} />
                ))}
              </div>
              <div className={styles.cardLabel}>{surprises.label}</div>
              <h3 className={styles.cardTitle}>{surprises.title}</h3>
              <p className={styles.cardText}>{surprises.text}</p>
            </article>

            <article className={`${styles.mini} dt-reveal-50`}>
              <div className={styles.miniSprites}>
                <Sprite file={viralPosts.sprite} />
              </div>
              <div className={styles.cardLabel}>{viralPosts.label}</div>
              <h3 className={styles.cardTitle}>{viralPosts.title}</h3>
              <p className={styles.cardText}>{viralPosts.text}</p>
            </article>

            <article className={`${styles.mini} dt-reveal-50`}>
              <div className={styles.miniSprites}>
                {founder.outfits.map((outfit) => (
                  <Sprite key={outfit.sprite} file={outfit.sprite} alt={outfit.name} />
                ))}
              </div>
              <div className={styles.cardLabel}>{founder.label}</div>
              <h3 className={styles.cardTitle}>{founder.title}</h3>
              <p className={styles.cardText}>{founder.text}</p>
            </article>
          </div>

          <div className={`${styles.feature} dt-reveal-50`}>
            <div className={styles.featureCopy}>
              <div className={styles.cardLabel}>{away.label}</div>
              <h3 className={styles.featureTitle}>{away.title}</h3>
              <p className={styles.featureText}>{away.text}</p>
            </div>
            <div className={styles.featureStage}>
              <PixelImage file={away.scene} width={64} height={40} alt={away.alt} className={styles.awayArt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
