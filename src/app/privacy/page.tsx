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
  title: "Privacy Policy",
  description: pageDescriptions[routes.privacy],
  path: routes.privacy,
});

// The apps link this page as their privacy policy (store listings, paywalls, settings), so each app's clauses follow
// what that app collects today. Garage to AGI's come from docs/legal/privacy-policy.md in its repo; Duoly in Love's
// from the privacy boundary in its docs/system-architecture.md, its iOS privacy manifest and its Supabase migrations.
const CLAUSES: LegalClause[] = [
  {
    title: "Who we are",
    body: [
      <>
        Dan Tech Indiv. (“Dan Tech”, “we”) is the independent studio of Danh Tran (Trần Hữu Danh) in Vietnam, who
        decides how the personal data described here is used (the “controller”). For anything in this policy, write
        to <a href={`mailto:${site.email}`}>{site.email}</a>.
      </>,
      "This policy covers dantech.app and every app we publish on Google Play and the Apple App Store. Clauses named after one app describe that app only; the others apply to all of them.",
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
    title: "Garage to AGI: what it collects",
    body: [
      "You do not create an account or sign in, and the game never asks for your name, email address, phone number or contacts. Your progress, settings, purchase ledger and the clock readings used to pay time-away earnings stay on your phone and in your phone’s backup. Local notifications and the picture you can share from the AGI moment are made on the phone; a shared picture goes only to the app you choose.",
      "Google AdMob and its consent platform receive your advertising identifiers (on Android the advertising ID and app set ID; on iPhone the IDFA, only if you allow tracking), IP address and the approximate location derived from it, device and app information, ad requests and interactions, to show the rewarded ads you choose, confirm the reward, measure ads and prevent fraud. Firebase Analytics receives an app instance ID, game events (tutorial steps, models shipped, rounds closed, chips earned and spent, ads watched, purchases with product, value and currency), properties such as your furthest era and whether VC Backing is active, device model, OS version, language and approximate location; the advertising ID only while advertising storage is allowed. Firebase Crashlytics receives crash reports with recent log lines and an installation ID; Firebase Remote Config receives an installation ID, the app version, language, country and time zone, to deliver settings without an update.",
      "RevenueCat receives a random anonymous user ID, your purchase history (product, transaction ID, price, currency, dates, subscription status) and store receipts, to validate, deliver and restore purchases; while analytics storage is allowed, also the Firebase app instance ID. Analytics never receives a personal user ID or free text.",
    ],
  },
  {
    title: "Garage to AGI: your choices",
    body: [
      "Analytics and advertising storage start switched off on every install. The consent step switches them on: without asking where no consent is required, and only as you choose where Google’s consent form applies; change your choice at any time in SHOP → SETTINGS → Privacy options (the row appears where it applies). On iPhone, Apple’s tracking prompt may follow the consent form; “Ask App Not to Track” keeps the IDFA unused. On Android you can reset or delete the advertising ID in your device settings.",
      "Under some US state laws, personalised ads may count as “sharing” personal information; where Google’s US state privacy message appears, you can opt out in SHOP → SETTINGS → Privacy options.",
    ],
  },
  {
    title: "Garage to AGI: backups",
    body: "There is no cloud save. On Android the game limits its backup to what it needs to bring your game back (the save and its safety copies, settings, the purchase ledger and subscription cache, and the purchases SDK’s own file); Google keeps it under your Google account and we cannot reach it. On iPhone the game is part of your normal device backup. Purchases always come back from the store through SHOP → SETTINGS → Restore purchases.",
  },
  {
    title: "Garage to AGI: online features",
    body: [
      "Weekend events and a weekly board are available after the Series D funding round while the Online features switch in SHOP → SETTINGS is on. The game then signs in to an anonymous Firebase account, with no name, email or password, and our servers (Google Cloud Firestore and Cloud Functions) store: the anonymous ID, the date they first saw it and the day of your last visit; a lab name the server picks from its own word lists, and your titles; for ranked events you join, when you joined, your best score and when you reached it, whether a score was above what is possible, your bracket and final rank, and for Benchmark Wars the stage your lab is at; rewards held for you; your deepest era or layer each week on the weekly board; and today’s request counts, to limit abuse. Events without a leaderboard store nothing about you on our servers.",
      "Each request carries a device-integrity token (Firebase App Check, with Play Integrity or App Attest), and on Android a Firebase Cloud Messaging registration token; we store neither. Server logs record the time, IP address and user agent of each request. Other labs in your bracket see your lab name and score, and the weekly board shows every player your lab name, equipped title and deepest layer that week, never your ID. New game content downloads from Firebase Hosting without any ID.",
      "SHOP → SETTINGS → Delete online data (tap it twice) erases your profile, scores, entries, board rows and rewards and turns the switch off on that phone. For 180 days we keep a keyed hash of the ID with the date it was first seen and the date of the deletion, so deleting cannot reset the anti-cheat checks, and for up to two days today’s request count; the anonymous Firebase account itself (an ID and its sign-in dates, no game data) stays until you ask us to delete it. On iPhone the anonymous ID may survive reinstalling the game; on Android a reinstall or a new phone starts a new one, and we delete the old one’s data on request (send your lab name and roughly when you played).",
    ],
  },
  {
    title: "Garage to AGI: how long data is kept",
    body: "Game data on your phone: until you delete the game, plus the life of your backups. Analytics events: up to 14 months. Crash reports: 90 days. Ads and remote settings: as Google’s policies describe. Purchase records: as long as needed to restore purchases and meet accounting and tax duties. Support emails: up to two years after the conversation ends. Online data: until you delete it or ask us to; weekly board rows four weeks after that week ends; server request logs 30 days.",
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
        effective="5 November 2026"
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
