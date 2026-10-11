import { Icon } from "./icon";
import styles from "./phone-mockup.module.css";

type PhoneMockupProps = {
  screen: string;
  alt: string;
  /** `regular` and `large` sit in hero layouts; `card` is the small tilted phone inside home cards. */
  size: "regular" | "large" | "card";
  /** Status bar ink: `dark` over light app screens (Duoly), `light` over dark ones (Kim Tài). */
  statusInk: "dark" | "light";
  /** Per-placement rotation, offsets and stacking. */
  className?: string;
  loading?: "eager" | "lazy";
};

export function PhoneMockup({ screen, alt, size, statusInk, className, loading = "lazy" }: PhoneMockupProps) {
  const frameClass = [styles.phone, styles[size], className].filter(Boolean).join(" ");

  return (
    <div className={frameClass}>
      {/* Decorative status bar; hidden so card links don't announce "9:41". */}
      <div className={`${styles.status} ${statusInk === "dark" ? styles.inkDark : styles.inkLight}`} aria-hidden="true">
        <span className={styles.time}>9:41</span>
        <span className={styles.indicators}>
          <Icon name="signal_cellular_alt" size={15} filled />
          <Icon name="wifi" size={15} filled />
          <Icon name="battery_full" size={17} filled className={styles.battery} />
        </span>
      </div>
      <img src={screen} alt={alt} className={styles.screen} loading={loading} decoding="async" />
    </div>
  );
}
