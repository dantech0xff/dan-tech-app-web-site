import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegalDocument, type LegalClause } from "@/components/legal-document";
import { SiteLink } from "@/components/site-link";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How dantech.app and the apps published by Dan Tech Indiv. handle your data.",
  path: routes.privacy,
});

const CLAUSES: LegalClause[] = [
  {
    title: "Who we are",
    body: (
      <>
        Dan Tech Indiv. (“Dan Tech”, “we”) is an independent software studio operated by Danh Tran in Vietnam. We
        publish Duoly in Love and Kim Tài · Tick Vàng Online. For anything in this policy, write to{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </>
    ),
  },
  {
    title: "This website",
    body: "dantech.app has no accounts, no advertising and no tracking pixels. Our hosting provider keeps standard server logs (IP address, browser, pages requested) for security and reliability. If you subscribe to Ship notes we store your email address to send product updates; every email carries an unsubscribe link. Messages sent through the contact page travel as ordinary email to admin@dantech.app.",
  },
  {
    title: "Our apps",
    body: (
      <>
        Each app links its own detailed policy from its store listing. In short: <strong>Duoly in Love</strong> treats
        notes as private content — the full text opens only when you tap it; widgets, notifications and other surfaces
        use generic content or limited metadata; the app never simulates your partner&apos;s activity; the only ads are
        rewarded ads you choose to watch, personalised only with your consent where the law requires it.{" "}
        <strong>Kim Tài</strong> stores the quantities and cost you record locally on your device; reference prices
        come from listed providers; the app shows ads through Google AdMob, and Premium removes them.
      </>
    ),
  },
  {
    title: "Purchases",
    body: "Premium is billed by Google Play or the Apple App Store and managed through RevenueCat. We receive purchase status, never your card details. Restores use the same store account that made the purchase.",
  },
  {
    title: "Third-party services",
    body: "Depending on the app: Google Play and App Store (distribution, billing), RevenueCat (entitlements), Google AdMob (ads), Firebase (crash reports, push), Supabase (Duo pairing and chat). Each processes data under its own policy; we configure them to collect the minimum the feature needs.",
  },
  {
    title: "Your rights",
    body: "You can access, correct or delete your data. In Duoly, delete notes, photos and your account from the Us tab. In Kim Tài your book lives only on your device. For anything else, email us; we answer within 2–3 working days and act on verified requests without charge.",
  },
  {
    title: "Children",
    body: "Our products are not directed to children under 13, and we do not knowingly collect their data. If you believe a child has provided us data, contact us and we will delete it.",
  },
  {
    title: "Changes",
    body: "We post changes here with a new effective date. Material changes to an app's data practices are also announced inside that app.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(routes.privacy)} />
      <LegalDocument
        title="Privacy Policy"
        effective="11 October 2026"
        clauses={CLAUSES}
        seeAlso={
          <>
            See also the <SiteLink href={routes.terms}>Terms of Service</SiteLink>.
          </>
        }
      />
    </>
  );
}
