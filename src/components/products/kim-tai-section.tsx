import { PhoneMockup } from "@/components/phone-mockup";
import { StoreButton } from "@/components/store-button";
import { apps, kimTaiFeatures } from "@/content/products";
import { storeLinks } from "@/content/site";
import { productAnchors } from "@/lib/routes";
import { FeatureList, ProductIntro } from "./product-parts";
import styles from "./products.module.css";

export function KimTaiSection() {
  return (
    <section id={productAnchors.kimTai} className={`${styles.section} ${styles.alt}`}>
      <div className={styles.inner}>
        <div className={`${styles.kimTaiVisual} dt-reveal-50`}>
          <div className={styles.kimTaiGlow} />
          <PhoneMockup
            size="large"
            statusInk="light"
            screen="/assets/kimtai-screen-ledger.png"
            alt="Kim Tài — overview"
            className={styles.kimTaiPhone}
          />
          <div className={styles.gainBadge}>
            <div className={styles.gainLabel}>ESTIMATED GAIN</div>
            <div className={styles.gainValue}>+7,6%</div>
            <div className={styles.gainNote}>on 8 chỉ · reference price</div>
          </div>
        </div>

        <div className={`${styles.copy} dt-reveal-50`}>
          <ProductIntro
            accent="kimTai"
            icon={apps.kimTai.icon}
            eyebrow="02 · Personal finance"
            title={apps.kimTai.name}
          />
          <p className={styles.pitch}>{apps.kimTai.pitch}</p>
          <FeatureList accent="kimTai" features={kimTaiFeatures} />
          <div className={styles.actions}>
            <StoreButton store="appStore" href={storeLinks.kimTaiAppStore} />
            <StoreButton store="googlePlay" href={storeLinks.kimTaiGooglePlay} />
          </div>
          <div className={styles.finePrint}>
            Displayed prices are for reference only — not transaction quotes or investment advice. Kim Tài does not sell
            gold.
          </div>
        </div>
      </div>
    </section>
  );
}
