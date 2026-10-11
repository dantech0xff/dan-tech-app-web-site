import { Icon } from "@/components/icon";
import ui from "@/components/ui.module.css";
import { academyFeatures } from "@/content/products";
import { site } from "@/content/site";
import { productAnchors } from "@/lib/routes";
import { FeatureList, ProductIntro } from "./product-parts";
import styles from "./products.module.css";

export function AcademySection() {
  return (
    <section id={productAnchors.academy} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.copy} dt-reveal-50`}>
          <ProductIntro
            accent="academy"
            icon="/assets/academy-logo.png"
            eyebrow="03 · Learning · Học lập trình với AI"
            title="Dan Tech Academy"
          />
          <p className={styles.pitch}>
            Where Vietnamese developers ship a real mobile app with AI, taught by someone who ships them. Not theory —
            build a real product and earn from it.
          </p>
          <FeatureList accent="academy" features={academyFeatures} />
          <div className={styles.actions}>
            <a href={site.academyUrl} target="_blank" rel="noopener" className={ui.lightButton}>
              Visit dantech.academy <Icon name="arrow_outward" size={18} />
            </a>
          </div>
        </div>

        <div className={`${styles.academyVisual} dt-reveal-50`}>
          <div className={styles.academyGlow} />
          <div className={styles.academyStack}>
            <div className={styles.courseCard}>
              <div className={styles.courseHead}>
                <div className={styles.courseLabel}>COURSE · MOBILE ACTION PRO</div>
                <div className={styles.courseModules}>10 MODULES</div>
              </div>
              <div className={styles.courseTitle}>From idea to a published app — with AI as your pair programmer.</div>
              <div className={styles.progress}>
                <div className={styles.progressBar} />
              </div>
              <div className={styles.courseFoot}>
                <span>MODULE 06 · MONETIZATION</span>
                <span>74 / 119 LESSONS</span>
              </div>
            </div>
            <div className={styles.miniGrid}>
              <div className={styles.miniCard}>
                <div className={styles.miniLabel}>KOTLIN ACCELERATOR</div>
                <div className={styles.miniValue}>120</div>
                <div className={styles.miniText}>lessons · 9 modules · 3 projects</div>
              </div>
              <div className={styles.miniCard}>
                <div className={styles.miniLabel}>INSTRUCTOR PROOF</div>
                <div className={styles.miniValue}>10M+</div>
                <div className={styles.miniText}>downloads across Dan&apos;s own apps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
