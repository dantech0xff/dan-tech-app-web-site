import { art } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";

type PixelImageProps = {
  /** File name inside `public/assets/idle-ai-tycoon/`. */
  file: string;
  /** Intrinsic size of the pixel art (16 for sprites, 128×48 for scenes). */
  width: number;
  height: number;
  /** Leave empty for decoration; the text next to the image already names it. */
  alt?: string;
  className?: string;
  eager?: boolean;
};

/** Pixel art from the game, drawn with hard edges at any size. */
export function PixelImage({ file, width, height, alt = "", className, eager = false }: PixelImageProps) {
  return (
    <img
      src={art(file)}
      alt={alt}
      width={width}
      height={height}
      className={className ? `${styles.pixel} ${className}` : styles.pixel}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/** A 16×16 sprite shown at three times its size unless `className` says otherwise. */
export function Sprite({ file, alt, className }: { file: string; alt?: string; className?: string }) {
  return <PixelImage file={file} width={16} height={16} alt={alt} className={className ? `${styles.sprite} ${className}` : styles.sprite} />;
}
