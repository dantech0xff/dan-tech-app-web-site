export type Feature = {
  /** Material Symbols name. */
  icon: string;
  title: string;
  text: string;
};

export const duolyFeatures: Feature[] = [
  { icon: "favorite", title: "Count your days together", text: "Total days, years–months–days, or your start date. Tap to switch." },
  { icon: "auto_stories", title: "Story & notes", text: "A line or a page, with photos. Memories settle into a warm wall." },
  { icon: "forum", title: "Duo — a private line", text: "Pair with a code; chat with moods, photos and a shared look." },
  { icon: "celebration", title: "Milestones & big days", text: "Day 100, day 1000, anniversaries — with share-ready keepsake cards." },
  { icon: "add_reaction", title: "A mood a day", text: "One tap. A 7-day rhythm that is a sentence, not a score." },
  { icon: "widgets", title: "Widgets & AI", text: "Day count on the home screen; AI suggests words when they run out." },
];

export const kimTaiFeatures: Feature[] = [
  { icon: "menu_book", title: "Holdings book", text: "Chỉ or Lượng, 9999 or 24K; cost and value in one glance." },
  { icon: "trending_up", title: "Reference prices", text: "DOJI, PNJ, SJC and more — buy, sell and update time, by region and product." },
  { icon: "phonelink_lock", title: "Private by design", text: "Holdings stay on your device. Biometric lock, if you want it." },
  { icon: "palette", title: "Five Elements · Premium", text: "Kim, Mộc, Thuỷ, Hoả, Thổ skins — and no ads." },
];

export const earlierGames = [
  {
    name: "KBC Quiz Game",
    image: "/assets/kbc.png",
    alt: "KBC Quiz Game",
    meta: "QUIZ · ANDROID + iOS",
    text: "A “Who Wants to Be a Millionaire”-style quiz: 15 difficulty levels, lifelines, and a monetization model that worked.",
  },
  {
    name: "Woody Hexa Puzzle",
    image: "/assets/woody.png",
    alt: "Woody Hexa Puzzle",
    meta: "PUZZLE · ANDROID + iOS",
    text: "A hexagonal puzzle that tests spatial thinking — warm wood textures, a calm loop.",
  },
  {
    name: "Katsu Ninja · Dark Moon Knight",
    image: "/assets/katsu.png",
    alt: "Katsu Ninja",
    meta: "ENDLESS RUNNER · ANDROID + iOS",
    text: "A dramatic endless runner about a ninja saving his village. Took third prize in competition.",
    award: "3rd prize",
  },
];
