import type { CSSProperties } from "react";
import styles from "./icon.module.css";

type IconProps = {
  /** Material Symbols ligature name, e.g. "arrow_forward". */
  name: string;
  size: number;
  filled?: boolean;
  className?: string;
};

/**
 * Material Symbols Outlined glyph. Like the design, it only sets family, size
 * and line height, so weight, colour and spacing come from the parent.
 */
export function Icon({ name, size, filled = false, className }: IconProps) {
  const style: CSSProperties = { fontSize: size };
  if (filled) style.fontVariationSettings = "'FILL' 1";

  return (
    <span aria-hidden="true" className={className ? `${styles.icon} ${className}` : styles.icon} style={style}>
      {name}
    </span>
  );
}
