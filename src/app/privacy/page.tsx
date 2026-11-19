import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegalDocument, type LegalClause } from "@/components/legal-document";
import { LegalText } from "@/components/legal-text";
import { SiteLink } from "@/components/site-link";
import { garageToAgiPrivacy } from "@/content/garage-to-agi-privacy";
import { pageDescriptions } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: pageDescriptions[routes.privacy],
  path: routes.privacy,
});

// The apps link this page as their privacy policy (store listings, paywalls, settings), so each app's clauses follow
// what that app collects today. Duoly in Love's come from the privacy boundary in its docs/system-architecture.md, its
// iOS privacy manifest and its Supabase migrations. Garage to AGI's policy is published whole, word for word as its
// owner approved it (src/content/garage-to-agi-privacy.ts), at the end of the page.

/** Anchor of Garage to AGI's own policy, for links from the game and its store listings. */
const GAME_POLICY_ID = "garage-to-agi";

const CLAUSES: LegalClause[] = [
  {
    title: "Who we are",
    body: [
      <>
        Dan Tech Indiv. (“Dan Tech”, “we”) is the independent studio of Danh Tran (Trần Hữu Danh) in Vietnam, who
        decides how the personal data described here is used (the “controller”). For anything in this policy, write
        to <a href={`mailto:${site.email}`}>{site.email}</a>.
      </>,
      "This policy covers dantech.app and every app we publish on Google Play and the Apple App Store. Clauses named after one app describe that app only; the others apply to all of them, except Garage to AGI, whose own policy follows at the end of this page.",
    ],
  },
  {
    title: "This website",
    body: "dantech.app has no accounts, no advertising and no tracking pixels. Our host, Cloudflare, processes each request (IP address, browser, page requested) to serve the site and protect it. If you subscribe to Ship notes we store your email address to send product updates; every email carries an unsubscribe link. Messages sent through the contact page travel as ordinary email to admin@dantech.app.",
  },
  {
    title: "Duoly in Love: your account and what it stores",
    body: [
      "Duoly works without an account on one phone. Signing in with Google or Apple gives us your name, email address and an account ID, and keeps your couple’s data on our servers (Supabase) so it syncs and survives a new phone: the couple’s names and start date, the cover photo and avatars, your notes and their photos, and the daily mood you share. Your notes sync only between the phones signed in to your own account; your partner never sees them.",
      "Once you pair with your partner, the two accounts share a private space that only the two of you can read: Duo messages and the photos sent in them, the chat theme, your Secret Questions cards and both answers, and reminders. To tell your partner’s phone that something new arrived, we keep its push token (Firebase Cloud Messaging) with the account; a push names the sender but never carries what was written or sent. Unpairing, or deleting either account, deletes that shared space with all its messages, photos, cards and answers.",
      "Note photos added since 6 August 2026 and Duo photos are stored privately and opened only through links that expire after an hour. Note photos added before that date, the cover photo and the avatars are stored at long, unguessable addresses that open for anyone who has the exact address; nobody can list them.",
    ],
  },
  {
    title: "Duoly in Love: what stays on your phone",
    body: "Widgets and notifications never show the text or photos of a note: the widget knows only whether you wrote today, plus the one line you leave for yourself on your own page. The full text of a note opens only when you tap it. The app never makes up activity for your partner. App lock asks for your phone’s fingerprint or face unlock before the app opens; it is a lock, not encryption.",
  },
  {
    title: "Duoly in Love: AI write",
    body: "When you use AI write, the text of the note you are writing and your request go to Google’s Gemini model through Firebase AI Logic to produce the draft. We use Google’s paid tier, whose terms do not let Google use that text to improve its products. Text the AI wrote is labelled as AI-generated in the app.",
  },
  {
    title: "Duoly in Love: ads, analytics and purchases",
    body: [
      "The only ad is a rewarded ad you choose to watch to unlock one AI write on the free version. Google AdMob’s software starts only when you tap to watch, never for Premium. Where the law requires consent (the EEA, the UK and US states with privacy laws), Google’s consent form decides whether the ad is personalised, and you can change your choice under Ad choices in the Us tab. On iPhone, Apple’s tracking prompt may appear when you tap to watch (never after you declined in the consent form); without permission, ads are not personalised, and you still get the reward. AdMob receives your device’s advertising identifier, IP address, approximate location and ad interactions.",
      "Firebase Analytics, Crashlytics and Performance Monitoring receive how features are used, crash reports and performance data, with an app instance ID; they never receive the text, titles or photos of your notes or messages, and analytics never reads the advertising identifier.",
      "Purchases are validated and restored through RevenueCat, which receives an app user ID and your purchase history. If you have Premium, your account records it so the partner you are paired with gets Premium too.",
    ],
  },
  {
    title: "Duoly in Love: signing out and deleting your account",
    body: "Signing out erases everything Duoly kept on the phone and restarts the app as if newly installed; notes that have not synced yet are lost, and the app warns you first. Delete account, at the bottom of the Us tab, deletes your photos and files, your notes, moods, couple data, Duo conversation and Secret Questions from our servers, then your account itself, and erases Duoly’s data on the phone. If a step fails the app says so and keeps your account as it was. If a file could not be deleted, email us and we will remove it. Purchases belong to your store account and are not affected.",
  },
  {
    title: "Garage to AGI",
    body: (
      <>
        Garage to AGI has a privacy policy of its own, given in full at the end of this page (
        <a href={`#${GAME_POLICY_ID}`}>Privacy Policy: Garage to AGI</a>). It describes everything the game collects,
        including its online features and the WORLD map, and for that game it takes the place of the other clauses of
        this policy.
      </>
    ),
  },
  {
    title: "Kim Tài",
    body: "Kim Tài stores the quantities and cost you record locally on your device; your book never leaves it. Reference prices come from listed providers. The app shows ads through Google AdMob, and Premium removes them.",
  },
  {
    title: "1010!",
    body: "1010! asks you to accept its privacy policy before ads start, and on iPhone shows Apple’s tracking prompt. Ads are served through Unity LevelPlay (ironSource), with Google AdMob and Unity Ads, which receive your device’s advertising identifier, IP address, device information and ad interactions; ads are personalised only with your consent where the law requires it, and Remove Ads is available as a purchase. Firebase Analytics, Crashlytics and Remote Config receive how the game is played, crash reports and an installation ID.",
  },
  {
    title: "Purchases",
    body: "Purchases in every app are billed by Google Play or the Apple App Store. We receive purchase status, never your card details. Restores use the same store account that made the purchase.",
  },
  {
    title: "Who receives data",
    body: [
      "Depending on the app: Google Play and the App Store (distribution, billing), RevenueCat (purchases), Google AdMob and its consent platform, Unity LevelPlay and Unity Ads (ads), Firebase (analytics, crash reports, performance, remote settings, push, AI write, and Garage to AGI’s online features), Supabase (Duoly’s accounts, sync, pairing and Duo) and Cloudflare (this website). Each processes data under its own policy, and we configure them to collect what the feature needs.",
      "We also share data with authorities when the law requires it, and with a buyer of an app if it is ever transferred (we will tell you first). We do not sell your personal information.",
    ],
  },
  {
    title: "Legal bases and international transfers",
    body: "Where laws such as the GDPR apply, we rely on the contract with you to run accounts, sync, pairing, Duo and purchases; on your consent for personalised ads, for storing or reading advertising information on your device, and for analytics where consent is required; on legitimate interests for crash reports, remote settings, non-personalised ads, fraud prevention and fair online rankings; and on legal obligation for records the law requires. These providers may process data outside your country, including in the United States; transfers from the EEA, the UK and Switzerland rely on the safeguards they offer, such as the EU Standard Contractual Clauses.",
  },
  {
    title: "Your rights",
    body: "Depending on where you live, you may have the right to access, correct, delete or port your data, to object to or restrict its use, to withdraw consent at any time, and to complain to your data protection authority; US state residents may also opt out of sale or sharing and must not be treated differently for using these rights. In Duoly, delete notes, photos and your account from the Us tab. In Garage to AGI, delete the game for its on-device data and use Delete online data for its servers. For anything else, email us; we answer within the time the law sets (one month under the GDPR, 45 days under the CCPA), usually within 2–3 working days, and act on verified requests without charge.",
  },
  {
    title: "Children",
    body: "Our apps are for people aged 13 and over and are not directed to children under 13; we do not knowingly collect their data. If you believe a child under 13 has used an app and data about them was collected, contact us and we will delete what we can. If you are under the age at which you can consent on your own in your country, ask a parent or guardian before you agree to personalised ads.",
  },
  {
    title: "Security",
    body: "The apps send data only over encrypted connections (HTTPS). Duoly’s servers let each account read only its own data and its couple’s shared space.",
  },
  {
    title: "Changes",
    body: "We post changes here with a new effective date. Material changes to an app’s data practices are also announced inside that app or on its store listing before they apply.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(routes.privacy)} />
      <LegalDocument
        title="Privacy Policy"
        effective="19 November 2026"
        clauses={CLAUSES}
        appendix={<LegalText id={GAME_POLICY_ID} source={garageToAgiPrivacy} />}
        seeAlso={
          <>
            See also the <SiteLink href={routes.terms}>Terms of Service</SiteLink>.
          </>
        }
      />
    </>
  );
}
