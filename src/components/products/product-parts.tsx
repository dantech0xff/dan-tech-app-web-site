import { Icon } from "@/components/icon";
import type { Feature } from "@/content/products";
import styles from "./products.module.css";

export type ProductAccent = "duoly" | "kimTai" | "academy";

const ICON_SHADOW: Record<ProductAccent, string> = {
  duoly: styles.shadowDuoly,
  kimTai: styles.shadowKimTai,
  academy: styles.shadowAcademy,
};

const FEATURE_ICON: Record<ProductAccent, string> = {
  duoly: styles.iconDuoly,
  kimTai: styles.iconKimTai,
  academy: styles.iconAcademy,
};

type ProductIntroProps = {
  accent: ProductAccent;
  icon: string;
  eyebrow: string;
  title: string;
};

/** App icon beside the eyebrow and product name. */
export function ProductIntro({ accent, icon, eyebrow, title }: ProductIntroProps) {
  return (
    <div className={styles.intro}>
      <img src={icon} alt="" width={64} height={64} loading="lazy" className={`${styles.introIcon} ${ICON_SHADOW[accent]}`} />
      <div className={styles.introText}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h2 className={styles.title}>{title}</h2>
      </div>
    </div>
  );
}

export function FeatureList({ accent, features }: { accent: ProductAccent; features: Feature[] }) {
  return (
    <div className={styles.features}>
      {features.map((feature) => (
        <div key={feature.title} className={styles.feature}>
          <Icon name={feature.icon} size={22} className={`${styles.featureIcon} ${FEATURE_ICON[accent]}`} />
          <div>
            <div className={styles.featureTitle}>{feature.title}</div>
            <div className={styles.featureText}>{feature.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const STORES = {
  googlePlay: { kicker: "GET IT ON", name: "Google Play" },
  appStore: { kicker: "DOWNLOAD ON THE", name: "App Store" },
};

export function StoreButton({ store, href }: { store: keyof typeof STORES; href: string }) {
  const { kicker, name } = STORES[store];
  return (
    <a href={href} target="_blank" rel="noopener" className={styles.storeButton}>
      <span className={styles.storeKicker}>{kicker}</span>
      <span className={styles.storeName}>{name}</span>
    </a>
  );
}
