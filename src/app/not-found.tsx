import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { SiteLink } from "@/components/site-link";
import ui from "@/components/ui.module.css";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main>
      <PageHero title="Page not found." lead="The page you are looking for has moved or never existed.">
        <div className={ui.buttonRow}>
          <SiteLink href={routes.home} className={ui.primaryButton}>
            Back to home <Icon name="arrow_forward" size={20} />
          </SiteLink>
        </div>
      </PageHero>
    </main>
  );
}
