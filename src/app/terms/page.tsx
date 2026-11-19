import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegalDocument, type LegalClause } from "@/components/legal-document";
import { LegalText } from "@/components/legal-text";
import { SiteLink } from "@/components/site-link";
import { garageToAgiTerms } from "@/content/garage-to-agi-terms";
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
// app's clauses follow what that app does today. Garage to AGI's terms are published whole, word for word as its owner
// approved them (src/content/garage-to-agi-terms.ts), at the end of the page. The owner's rule for these terms: they
// describe the apps and their service only, with no word on law, courts or legal matters (a test checks the page).

/** Anchor of Garage to AGI's own terms, for links from the game. */
const GAME_TERMS_ID = "garage-to-agi";

const CLAUSES: LegalClause[] = [
  {
    title: "Agreement",
    body: [
      "These terms are an agreement between you and Dan Tech Indiv. (“Dan Tech”, “we”), the independent studio of Danh Tran (Trần Hữu Danh) in Vietnam. They cover dantech.app and every app we publish on Google Play and the Apple App Store. By using the website, or by installing or using one of our apps, you accept them; if you do not accept them, do not use them.",
      "The terms of the store you downloaded an app from apply as well. For an app from the Apple App Store, Apple’s Licensed Application End User License Agreement also applies, and these terms add that app’s own rules. Clauses named after one app apply to that app only; the others apply to every app, except Garage to AGI, whose own terms follow at the end of this page.",
    ],
  },
  {
    title: "Who can use the apps",
    body: "Our apps are for people aged 13 and over. If you are under the age of majority where you live, a parent or guardian must accept these terms for you and should manage any purchases.",
  },
  {
    title: "Licence",
    body: "We give you a personal, non-exclusive, non-transferable, revocable licence to install and use our apps for your own non-commercial use. You may not copy, sell, rent or redistribute them, or reverse-engineer or modify them.",
  },
  {
    title: "Purchases",
    body: [
      "Purchases inside our apps go through Google Play or the Apple App Store. The store charges you, shows the price in your currency (with tax where it applies) before you confirm, and handles refunds under its own rules: through Google Play’s refund request, or through reportaproblem.apple.com for Apple. We cannot issue store refunds ourselves.",
      "A purchase the store marks as pending is delivered once the store completes it. Restore purchases, in the app, brings back subscriptions and one-time unlocks bought with the same store account; items used up when they are delivered do not come back.",
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
    body: "Some of our apps show ads from Google AdMob. A rewarded ad is always your choice: its reward arrives only after the ad network confirms you finished the ad, most rewards have a daily limit that the app shows, and we cannot promise that an ad is always available. Whether ads are personalised follows the choices you make in the app, as the Privacy Policy explains.",
  },
  {
    title: "Your content",
    body: "Notes, photos, messages, answers and records you create are yours. You grant us only the licence needed to run the feature you use, for example storing a Duo message and delivering it to your partner. You are responsible for what you share, and you agree not to use the apps to harass, deceive or harm anyone, or to share content that you have no right to share.",
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
    title: "Garage to AGI",
    body: (
      <>
        Garage to AGI has terms of their own, given in full at the end of this page (
        <a href={`#${GAME_TERMS_ID}`}>Terms of Service: Garage to AGI</a>). They cover the game’s chips and other
        virtual items, its purchases and passes, the Job Fair, rewarded ads and its online features, including the WORLD
        map, and for that game they take the place of the other clauses of these terms.
      </>
    ),
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
    title: "How the apps are provided",
    body: "The apps and this website are provided “as is” and “as available”. We do not promise that they suit a particular purpose or that they run without interruption or errors.",
  },
  {
    title: "Ending these terms",
    body: "You can stop at any time by deleting the app; cancel any subscription in the store first. We may end your licence if you seriously break these terms.",
  },
  {
    title: "Changes to these terms",
    body: "We post a new version here with a new effective date. For significant changes we also tell you in the app before they apply. If you keep using an app after that, the new terms apply.",
  },
  {
    title: "Contact",
    body: (
      <>
        Questions: <a href={`mailto:${site.email}`}>{site.email}</a>.
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
        effective="19 November 2026"
        clauses={CLAUSES}
        appendix={<LegalText id={GAME_TERMS_ID} source={garageToAgiTerms} />}
        seeAlso={
          <>
            See also the <SiteLink href={routes.privacy}>Privacy Policy</SiteLink>.
          </>
        }
      />
    </>
  );
}
