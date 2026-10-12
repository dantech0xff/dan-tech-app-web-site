import type { Metadata } from "next";
import { FounderSection } from "@/components/home/founder-section";
import { HomeHero } from "@/components/home/home-hero";
import { MissionSection } from "@/components/home/mission-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { ProductMarquee } from "@/components/home/product-marquee";
import { ProductsTeaser } from "@/components/home/products-teaser";
import { ReviewsSection } from "@/components/home/reviews-section";
import { pageDescriptions } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({ description: pageDescriptions[routes.home], path: routes.home });

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ProductMarquee />
      <ProductsTeaser />
      <MissionSection />
      <FounderSection />
      <ReviewsSection />
      <NewsletterSection />
    </main>
  );
}
