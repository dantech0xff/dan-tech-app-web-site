import styles from "./store-button.module.css";

const STORES = {
  googlePlay: { kicker: "GET IT ON", name: "Google Play" },
  appStore: { kicker: "DOWNLOAD ON THE", name: "App Store" },
};

/** Opens a store listing in a new tab. */
export function StoreButton({ store, href }: { store: keyof typeof STORES; href: string }) {
  const { kicker, name } = STORES[store];
  return (
    <a href={href} target="_blank" rel="noopener" className={styles.storeButton}>
      <span className={styles.storeKicker}>{kicker}</span>
      <span className={styles.storeName}>{name}</span>
    </a>
  );
}
