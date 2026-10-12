import { site } from "./site";

export type FaqGroup = {
  /** Short key; combined with the item index it identifies an answer (e.g. "g0"). */
  key: string;
  name: string;
  items: { q: string; a: string }[];
};

export const faqGroups: FaqGroup[] = [
  {
    key: "g",
    name: "The studio",
    items: [
      {
        q: "What is Dan Tech Indiv.?",
        a: `An independent, one-person software studio from Vietnam founded by ${site.founder}. It builds and publishes consumer mobile apps: Duoly in Love and Kim Tài.`,
      },
      {
        q: "Are the apps free?",
        a: "Yes. Duoly in Love and Kim Tài are free to download. Each has an optional Premium tier bought inside the app through Google Play or the App Store. The core of every app stays free, and nothing you create is locked behind a paywall.",
      },
      {
        q: "Which platforms do you support?",
        a: "Duoly in Love and Kim Tài are on both Android (Google Play) and iOS (App Store).",
      },
      {
        q: "Do you build apps for clients?",
        a: "Occasionally — partnerships, consulting and select freelance work. Write to admin@dantech.app with what you have in mind and where you are in the process.",
      },
    ],
  },
  {
    key: "d",
    name: "Duoly in Love",
    items: [
      {
        q: "Do both of us need the app?",
        a: "No. Duoly works fully even when only one of you uses it — and the app never pretends your partner is online or has “seen” anything. Pairing with a code unlocks Duo, the private chat for two.",
      },
      {
        q: "Are our notes private?",
        a: "Notes are private content: the full text opens only when you tap it yourself. Widgets, notifications and other surfaces use generic content or limited metadata. The widget knows whether something was written today — never what.",
      },
      {
        q: "Is there an iOS version?",
        a: "Yes. Duoly in Love is on the App Store as well as Google Play — both builds share the same codebase, so features arrive together.",
      },
      {
        q: "What does Premium include?",
        a: "AI writing without limits or ads, premium milestone card templates with watermark-free sharing, five premium fonts (eight in total) and biometric app lock. Monthly, yearly and lifetime prices are shown in the app.",
      },
    ],
  },
  {
    key: "k",
    name: "Kim Tài",
    items: [
      {
        q: "Does Kim Tài sell gold or give investment advice?",
        a: "No. Kim Tài is a tracking tool: it does not sell gold, does not set transaction prices for you and does not give investment advice. Prices are reference prices listed per provider, with the source shown when available.",
      },
      {
        q: "Where is my gold data stored?",
        a: "The quantities and cost details you record are stored locally on your device. Deleting the app deletes the book; back up with your device if you want to keep it.",
      },
      {
        q: "Does Kim Tài show ads?",
        a: "Yes, through Google AdMob. If you allow the advertising identifier to be shared, ads are personalised; if you refuse, ads still show in a default, non-personalised form. The Premium plan removes ads.",
      },
    ],
  },
  {
    key: "s",
    name: "Account & support",
    items: [
      {
        q: "How do I delete my data or account?",
        a: "In Duoly, delete notes, photos and your account from the Us tab. In Kim Tài your book lives only on your device, so deleting the app removes it. For anything else, email admin@dantech.app — replies take 2–3 working days.",
      },
      {
        q: "How do I restore Premium on a new phone?",
        a: "Use “Restore purchases” inside the app with the same Google Play or Apple account that bought it. Premium is tied to that store account.",
      },
      {
        q: "I found a bug. Where do I report it?",
        a: "Email admin@dantech.app with the app name, your device model and OS version, and what you expected to happen. Screenshots help. Crash reports arrive automatically through Firebase, but a sentence from you is worth ten of them.",
      },
    ],
  },
];

/** The first studio question starts expanded, as in the design. */
export const DEFAULT_OPEN_FAQ = "g0";
