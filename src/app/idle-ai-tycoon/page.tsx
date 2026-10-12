import type { Metadata } from "next";
import { preload } from "react-dom";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { CollectSection } from "@/components/idle-ai-tycoon/collect-section";
import { EventsSection } from "@/components/idle-ai-tycoon/events-section";
import { GameHero } from "@/components/idle-ai-tycoon/game-hero";
import styles from "@/components/idle-ai-tycoon/game.module.css";
import { GameplaySection } from "@/components/idle-ai-tycoon/gameplay-section";
import { MomentsSection } from "@/components/idle-ai-tycoon/moments-section";
import { WorldsSection } from "@/components/idle-ai-tycoon/worlds-section";
import { game } from "@/content/idle-ai-tycoon";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: game.title,
  description: game.description,
  path: routes.idleAiTycoon,
  image: { url: game.icon.src, width: game.icon.width, height: game.icon.height, alt: game.icon.alt },
});

export default function IdleAiTycoonPage() {
  // The page's pixel font, preloaded from <head> on this route only (see the @font-face in game.module.css).
  preload("/fonts/jersey-10.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <main className={styles.page}>
      <GameHero />
      <GameplaySection />
      <WorldsSection />
      <MomentsSection />
      <CollectSection />
      <EventsSection />
      <NewsletterSection />
    </main>
  );
}
