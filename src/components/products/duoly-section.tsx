import { PhoneMockup } from "@/components/phone-mockup";
import { duolyFeatures } from "@/content/products";
import { storeLinks } from "@/content/site";
import { productAnchors } from "@/lib/routes";
import { FeatureList, ProductIntro, StoreButton } from "./product-parts";
import styles from "./products.module.css";

export function DuolySection() {
  return (
    <section id={productAnchors.duoly} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.copy} dt-reveal-50`}>
          <ProductIntro
            accent="duoly"
            icon="/assets/duoly-icon.png"
            eyebrow="01 · For couples · formerly Amor AI"
            title="Duoly in Love"
          />
          <p className={styles.pitch}>
            A private, gentle space for one couple — a daily ritual for keeping the small moments and staying
            connected. Not a social network, not a tracker.
          </p>
          <FeatureList accent="duoly" features={duolyFeatures} />
          <div className={styles.actions}>
            <StoreButton store="googlePlay" href={storeLinks.duolyGooglePlay} />
            <StoreButton store="appStore" href={storeLinks.duolyAppStore} />
          </div>
          <div className={styles.finePrint}>
            Free keeps the core. Premium — monthly, yearly or lifetime — adds AI without limits, premium keepsakes, five
            fonts and app lock. Prices shown in-app.
          </div>
        </div>

        <div className={`${styles.duolyVisual} dt-reveal-50`}>
          <div className={styles.duolyGlow} />
          <PhoneMockup
            size="regular"
            statusInk="dark"
            screen="/assets/duoly-screen-today.png"
            alt="Duoly — Today"
            className={styles.duolyPhoneBack}
          />
          <PhoneMockup
            size="regular"
            statusInk="dark"
            screen="/assets/duoly-screen-duo.png"
            alt="Duoly — Duo chat"
            className={styles.duolyPhoneFront}
          />
        </div>
      </div>
    </section>
  );
}
