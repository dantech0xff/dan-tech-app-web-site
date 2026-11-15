import { install } from "@/content/idle-ai-tycoon";
import { storeLinks } from "@/content/site";
import { qrCode, qrPath } from "@/lib/qr-code";
import styles from "./game.module.css";

/** Quiet zone, in modules, as the standard asks. */
const MARGIN = 4;

/** Encoded when the page is built, so the page ships a finished SVG and no script. */
const modules = qrCode(storeLinks.garageToAgiGooglePlay);
const side = modules.length + MARGIN * 2;
const path = qrPath(modules, MARGIN);

/**
 * Desktop only (hidden on touch screens, where the store button is one tap away): the listing as a QR code. Drawn at
 * 2 or 3 CSS pixels a module (90 or 135px for its 45 modules), so every module has the same width on any screen.
 */
export function GooglePlayQr({ large = false }: { large?: boolean }) {
  return (
    <figure className={styles.qr}>
      <svg
        className={large ? `${styles.qrCode} ${styles.qrLarge}` : styles.qrCode}
        viewBox={`0 0 ${side} ${side}`}
        role="img"
        aria-label={install.qr.label}
        shapeRendering="crispEdges"
      >
        <rect width={side} height={side} fill="#F4F4F4" />
        <path d={path} fill="#1A1C2C" />
      </svg>
      <figcaption className={styles.qrCaption}>{install.qr.caption}</figcaption>
    </figure>
  );
}
