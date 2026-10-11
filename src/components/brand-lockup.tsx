import { SiteLink } from "./site-link";
import { routes } from "@/lib/routes";
import styles from "./brand-lockup.module.css";

type BrandLockupProps = {
  /** Header lockup carries the mark's alt text and extra tap padding; footer is decorative. */
  placement: "header" | "footer";
};

export function BrandLockup({ placement }: BrandLockupProps) {
  return (
    <SiteLink href={routes.home} className={`${styles.lockup} ${styles[placement]}`}>
      <img
        src="/assets/dantech-mark.png"
        alt={placement === "header" ? "Dan Tech" : ""}
        width={30}
        height={30}
        className={styles.mark}
      />
      <span className={styles.wordmark}>
        <span className={styles.name}>dan tech</span>
        <span className={styles.suffix}>indiv.</span>
      </span>
    </SiteLink>
  );
}
