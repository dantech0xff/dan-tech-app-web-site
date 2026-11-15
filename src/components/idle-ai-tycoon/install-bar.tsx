"use client";

import { useEffect, useState } from "react";
import { StoreButton } from "@/components/store-button";
import { anchors, game, install } from "@/content/idle-ai-tycoon";
import { storeLinks } from "@/content/site";
import styles from "./game.module.css";

/** Room the bar takes at the bottom of the screen, kept clear for focused elements while it shows. */
const BAR_CLEARANCE = "96px";

/**
 * The game's name and its Google Play button, pinned to the bottom of the screen between the hero's buttons and the
 * closing download section, so the store is one tap away anywhere in between. Off screen it is inert: no focus, no
 * announcement.
 */
export function InstallBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(install.heroButtonsId);
    const closing = document.getElementById(anchors.download);
    if (!hero || !closing) return;

    // Read positions on every scroll and resize, once a frame: an observer misses a jump (a dragged scrollbar, a
    // wheel without smooth scrolling) that skips both targets without either crossing the viewport.
    let frame = 0;
    const update = () => {
      frame = 0;
      const heroPassed = hero.getBoundingClientRect().bottom <= 0;
      const closingReached = closing.getBoundingClientRect().top < window.innerHeight;
      setVisible(heroPassed && !closingReached);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // While the bar shows, focus scrolling keeps the focused element above it.
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollPaddingBottom = visible ? BAR_CLEARANCE : "";
    return () => {
      root.style.scrollPaddingBottom = "";
    };
  }, [visible]);

  return (
    <aside className={styles.installBar} data-visible={visible} aria-label={install.bar.name} aria-hidden={!visible} inert={!visible}>
      <img className={styles.installIcon} src={game.icon.src} alt="" width={48} height={48} />
      <div className={styles.installText}>
        <span className={styles.installName}>{install.bar.name}</span>
        <span className={styles.installLine}>{install.bar.line}</span>
      </div>
      <StoreButton store="googlePlay" href={storeLinks.garageToAgiGooglePlay} />
    </aside>
  );
}
