import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { pageDescriptions } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbs, faqPage } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: pageDescriptions[routes.faq],
  path: routes.faq,
});

export default function FaqPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs(routes.faq)} />
      <JsonLd data={faqPage()} />
      <PageHero
        title="Quick answers."
        lead={
          <>
            About the studio, the apps and your account. Anything else: <a href={`mailto:${site.email}`}>{site.email}</a>.
          </>
        }
      />
      <FaqList />
    </main>
  );
}
