"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroVideo } from "@/content/idle-ai-tycoon";
import styles from "./game.module.css";

/**
 * The silent gameplay loop in the hero's phone. It plays only while on screen, and does not start by itself for
 * visitors who ask for reduced motion or to save data: they keep the poster, the loop's first frame. A button pauses
 * and resumes it at any time.
 */
export function GameplayVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  /** Whether the visitor wants it to play (by default, or by the button); it also waits while off screen. */
  const wanted = useRef(false);
  const onScreen = useRef(false);
  const [playing, setPlaying] = useState(false);

  const sync = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    // A browser may refuse to autoplay even a muted video; the poster then stays and the button offers play.
    if (wanted.current && onScreen.current) video.play().catch(() => {});
    else video.pause();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    wanted.current = !motion.matches && !connection?.saveData;

    const observer = new IntersectionObserver(([entry]) => {
      onScreen.current = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    const onMotionChange = () => {
      if (!motion.matches) return;
      wanted.current = false;
      sync();
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, [sync]);

  return (
    <>
      <video
        ref={ref}
        className={styles.phoneVideo}
        poster={heroVideo.poster}
        width={heroVideo.width}
        height={heroVideo.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={heroVideo.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={heroVideo.mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        className={styles.videoToggle}
        aria-label={playing ? heroVideo.pause : heroVideo.play}
        onClick={() => {
          wanted.current = !playing;
          // Played straight from the click, which some browsers require.
          if (wanted.current) ref.current?.play().catch(() => {});
          else sync();
        }}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </>
  );
}
