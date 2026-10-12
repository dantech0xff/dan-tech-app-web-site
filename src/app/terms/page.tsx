import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegalDocument, type LegalClause } from "@/components/legal-document";
import { SiteLink } from "@/components/site-link";
import { pageDescriptions } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: pageDescriptions[routes.terms],
  path: routes.terms,
});

const CLAUSES: LegalClause[] = [
  {
    title: "Agreement",
    body: "By using dantech.app or any app published by Dan Tech Indiv. you agree to these terms. The store you downloaded from (Google Play or the Apple App Store) applies its own terms as well.",
  },
  {
    title: "Purchases and subscriptions",
    body: "Premium tiers are sold inside the apps through store billing. Monthly and yearly plans renew automatically until cancelled in your store's subscription settings; after cancelling you keep Premium until the end of the paid period. A lifetime purchase takes effect immediately but does not cancel a running subscription — the app reminds you to cancel it yourself. Restore purchases with the same store account. Refunds follow the store's policy.",
  },
  {
    title: "Your content",
    body: "Notes, photos, messages and records you create are yours. You grant us only the licence needed to run the feature you use (for example, delivering a Duo message to your partner). You are responsible for content you share, and you agree not to use the apps to harass, deceive or harm others.",
  },
  {
    title: "Kim Tài — information only",
    body: "Prices in Kim Tài are reference prices listed per provider, shown with their source and update time when available. They are not transaction quotes, and nothing in the app is investment advice. Kim Tài does not buy or sell gold.",
  },
  {
    title: "Acceptable use",
    body: "Do not reverse-engineer, resell or interfere with the apps or their services, or attempt to access another user's data. We may suspend access that breaks these rules.",
  },
  {
    title: "Intellectual property",
    body: "Dan Tech, Duoly in Love, Kim Tài and their logos, designs and code belong to Dan Tech Indiv. Third-party names are the property of their owners.",
  },
  {
    title: "Warranty and liability",
    body: "The apps and this website are provided as is. To the extent permitted by law, Dan Tech Indiv. is not liable for indirect or consequential loss arising from their use. Nothing here limits rights you have as a consumer under applicable law.",
  },
  {
    title: "Governing law and contact",
    body: (
      <>
        These terms are governed by the laws of Vietnam. Questions: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(routes.terms)} />
      <LegalDocument
        title="Terms of Service"
        effective="11 October 2026"
        clauses={CLAUSES}
        seeAlso={
          <>
            See also the <SiteLink href={routes.privacy}>Privacy Policy</SiteLink>.
          </>
        }
      />
    </>
  );
}
