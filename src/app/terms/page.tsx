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

// The apps link this page as their Terms of Use (Duoly in Love's and Garage to AGI's paywalls and settings), so each
// app's clauses follow what that app does today. Garage to AGI's come from docs/legal/terms-of-service.md in its repo.
const CLAUSES: LegalClause[] = [
  {
    title: "Agreement",
    body: [
      "These terms are an agreement between you and Dan Tech Indiv. (“Dan Tech”, “we”), the independent studio of Danh Tran (Trần Hữu Danh) in Vietnam. They cover dantech.app and every app we publish on Google Play and the Apple App Store. By using the website, or by installing or using one of our apps, you accept them; if you do not accept them, do not use them.",
      "The terms of the store you downloaded an app from apply as well. For an app from the Apple App Store, Apple’s Licensed Application End User License Agreement also applies, and these terms add that app’s own rules. Clauses named after one app apply to that app only; the others apply to every app.",
    ],
  },
  {
    title: "Who can use the apps",
    body: "Our apps are for people aged 13 and over. If you are under the age of majority where you live, a parent or guardian must accept these terms for you and should manage any purchases.",
  },
  {
    title: "Licence",
    body: "We give you a personal, non-exclusive, non-transferable, revocable licence to install and use our apps for your own non-commercial use. You may not copy, sell, rent or redistribute them, or reverse-engineer or modify them, except where the law expressly allows it.",
  },
  {
    title: "Purchases",
    body: [
      "Purchases inside our apps go through Google Play or the Apple App Store. The store charges you, shows the price in your currency (with tax where it applies) before you confirm, and handles refunds under its own rules: through Google Play’s refund request, or through reportaproblem.apple.com for Apple. We cannot issue store refunds ourselves.",
      "A purchase the store marks as pending is delivered once the store completes it. Restore purchases, in the app, brings back subscriptions and one-time unlocks bought with the same store account; items used up when they are delivered, such as Garage to AGI’s chip packs, do not come back.",
      "If you live in the EU or the UK, your right to withdraw from a purchase of digital content ends once the content is delivered with your consent; the store’s purchase flow handles this.",
    ],
  },
  {
    title: "Subscriptions",
    body: [
      "A subscription renews automatically at the end of each period, and the store charges your account for the next one, unless you cancel before then under the store’s rules (Apple asks for at least 24 hours before the period ends). The plan, its period and its price are shown in the app and on the store’s purchase sheet before you confirm.",
      "Manage or cancel a subscription in Google Play → Payments & subscriptions → Subscriptions, or in the subscription settings of your Apple Account. Deleting the app does not cancel it. After you cancel, you keep the benefits until the end of the period you paid for. If the store offers you a free trial, you are charged when it ends unless you cancel before then.",
    ],
  },
  {
    title: "Ads",
    body: "Some of our apps show ads from Google AdMob. A rewarded ad is always your choice: its reward arrives only after the ad network confirms you finished the ad, most rewards have a daily limit that the app shows, and we cannot promise that an ad is always available. Whether ads are personalised follows your consent where the law requires it, as the Privacy Policy explains.",
  },
  {
    title: "Your content",
    body: "Notes, photos, messages, answers and records you create are yours. You grant us only the licence needed to run the feature you use, for example storing a Duo message and delivering it to your partner. You are responsible for what you share, and you agree not to use the apps to harass, deceive or harm anyone, or to share content that is illegal or that you have no right to share.",
  },
  {
    title: "Duoly in Love: account, pairing and Duo",
    body: [
      "Pairing, Duo and Secret Questions need an account (sign in with Google or Apple). Once you pair with your partner, what you send in Duo and your answers in Secret Questions are shared with them and kept on our servers so both phones can show them. You can unpair at any time: unpairing, or deleting either account, deletes the conversation, its photos and the couple’s Secret Questions cards and answers for both of you. You can delete your account, with your notes and photos, from the Us tab.",
      "Unsending a Duo message removes it from the conversation in current versions of the app, not from everywhere: your partner may already have read or saved it, an older version of the app shows it until it is reopened, and backups keep it for as long as they are kept. Notifications tell you something new has arrived; they do not promise that your partner has seen it.",
    ],
  },
  {
    title: "Duoly in Love: Premium",
    body: [
      "Premium is offered as monthly and yearly subscriptions and as a one-time Lifetime purchase; the paywall lists what each includes. Buying Lifetime does not cancel a subscription you already have: the app tells you before you buy and reminds you afterwards to cancel it yourself in the store.",
      "Premium bought by one partner also applies to the partner linked with them, automatically, for as long as the two accounts stay linked. It ends for the partner when either of you unlinks; the buyer keeps it.",
    ],
  },
  {
    title: "Duoly in Love: AI write",
    body: "AI write drafts text from what you type, using a third-party AI service. A draft can be wrong or not what you meant, so read it before you keep or send it; what you save or send is your own content. On the free version each AI write is unlocked by a rewarded ad you choose to watch, up to a daily limit; with Premium there is no ad and no limit.",
  },
  {
    title: "Garage to AGI: your game data",
    body: "Your progress is saved on your phone. There is no cloud save and no game account, so we cannot recover lost progress. Your phone’s own backup may bring it back: Android’s backup to your Google account on a new phone or after a reinstall, or restoring an iPhone from a device backup. Purchases come back from the store (see Purchases).",
  },
  {
    title: "Garage to AGI: chips and other virtual items",
    body: [
      "Chips are the game’s virtual currency. You earn chips by playing and can buy them. Chips and the items you get with them (boosts, upgrades, recruits) are a limited licence to use inside the game: they have no cash value, cannot be exchanged for money or anything outside the game, and cannot be transferred or sold. Purchases of chips and items are final, except where the law or the store’s refund policy says otherwise.",
      "The number of chips in a paid pack is fixed when you buy it and is never changed remotely; prices in chips of in-game items may change with updates or balance settings. Chips and items live in your save: the game credits each chip pack once, so a lost save or a new game does not get them again, while the Starter Pack’s chips and hire come once to each game for as long as the store says you own it. We may change, rebalance or remove virtual items as the game evolves, within the limits of the law.",
    ],
  },
  {
    title: "Garage to AGI: VC Backing, Founder Pass and Starter Pack",
    body: [
      "VC Backing is a weekly subscription (see Subscriptions). While it is active, the x2 revenue boost is always on, rewarded ad rewards arrive without watching the ad (they still count toward the daily limits), you get +200 chips at your first session each day (missed days are not paid later), and time away earns for up to 16 hours instead of 8 (24 hours with the Server Uptime upgrade). The game checks the subscription with the store; if it cannot check for 72 hours, for example because you stay offline, the benefits pause until it can.",
      "The Founder Pass is a one-time purchase offered with weekend events. It unlocks the premium lane of every event reward track, in the event on when you buy it and in every event after it, for as long as we run weekend events; it has no time limit and nothing renews. It also gives 3,000 chips at once (once per game). In each event, every reward track tier you reach pays its chips twice more and its free recruits a second time, and the last tier of each track one more free recruit; tiers you reached earlier in the event that is on when you buy it pay too, and nothing is paid for events that already ended. The game checks the pass with the store; if it cannot check for 72 hours, the premium lane pauses until it can. A refund ends it.",
      "The Starter Pack is a one-time offer of 1,500 chips and an Epic hire (or +1 level of that hire if it is already on your team), shown for 72 hours from your first Shop visit after the Series A funding round.",
    ],
  },
  {
    title: "Garage to AGI: the Job Fair",
    body: "Recruiting at the Job Fair, with chips or free recruits, gives a random hire. Before you recruit, the ODDS button shows the odds of every rarity and of every hire, and the pity counters: Common 60%, Rare 28%, Epic 10%, Legendary 2%; the 10th recruit since your last Epic or better is Epic or better, and the 50th since your last Legendary is Legendary. Where the current era has specialists of a rarity, half of that rarity’s results go to them. A ten-recruit pull always contains an Epic or better, and a duplicate specialist refunds 30 chips. Odds are never changed remotely; if an update changes them, the odds screen shows the new values before you recruit. The game is not offered in Belgium, South Korea or mainland China.",
  },
  {
    title: "Garage to AGI: ad rewards and online features",
    body: [
      "Ad rewards are never chips. A free recruit from an ad follows the Job Fair’s rules, so a duplicate specialist still refunds 30 chips.",
      "Weekend events and a weekly board, when we switch them on, need an internet connection and use an anonymous online account; the server picks lab names. On the weekly board, a depth above what is possible for the time since our server first saw you counts as the deepest that was possible; in events, a score above what is possible takes the lab out of the ranking and earns no rank reward. Rank rewards need an online account at least 3 days old. You can turn online features off, or erase your online data, in SHOP → SETTINGS.",
    ],
  },
  {
    title: "Kim Tài — information only",
    body: "Prices in Kim Tài are reference prices listed per provider, shown with their source and update time when available. They are not transaction quotes, and nothing in the app is investment advice. Kim Tài does not buy or sell gold.",
  },
  {
    title: "Fair play and acceptable use",
    body: "Do not reverse-engineer, resell or interfere with the apps or their services, or try to reach another user’s data. Do not use cheats, bots, modified versions of an app, or tools that change its memory, time or network traffic to gain rewards, items or ranks; do not exploit bugs (report them to us instead), and do not abuse refunds or chargebacks to keep what you bought. If you break these rules we may withhold what was gained that way and suspend your access to online features or to the app.",
  },
  {
    title: "Intellectual property",
    body: "Dan Tech, Duoly in Love, Kim Tài, Garage to AGI, 1010! and their logos, art, music, text, designs and code belong to Dan Tech Indiv. or its licensors. Third-party names are the property of their owners; the licences of third-party parts, such as fonts, are listed inside each app.",
  },
  {
    title: "Changes and availability",
    body: "We update the apps to fix issues, rebalance them and add content, and features may change. We do not promise that an app or a feature will always be available. If we decide to stop offering an app, we will give notice in the app or on its store page at least 30 days ahead where we can; subscriptions then end through the store’s normal process.",
  },
  {
    title: "Warranty and liability",
    body: [
      "The apps and this website are provided “as is” and “as available”. To the extent the law allows, we disclaim implied warranties, including fitness for a particular purpose and uninterrupted or error-free operation.",
      "To the extent the law allows, we are not liable for indirect or consequential loss, lost profits or lost data, and our total liability for any claim is limited to what you paid for purchases in the app concerned in the 12 months before the claim. Nothing here limits liability that cannot be limited by law, or rights you have as a consumer under the law of the country where you live.",
    ],
  },
  {
    title: "Ending these terms",
    body: "You can stop at any time by deleting the app; cancel any subscription in the store first. We may end your licence if you seriously break these terms. The clauses on virtual items, intellectual property, warranty and liability, and governing law keep applying after that.",
  },
  {
    title: "Changes to these terms",
    body: "We post a new version here with a new effective date. For significant changes we also tell you in the app before they apply. If you keep using an app after that, the new terms apply.",
  },
  {
    title: "Governing law and contact",
    body: (
      <>
        These terms are governed by the laws of Vietnam, without taking away the protection that the mandatory law of
        the country where you live gives you. Questions: <a href={`mailto:${site.email}`}>{site.email}</a>.
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
        effective="5 November 2026"
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
