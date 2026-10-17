export const site = {
  name: "Dan Tech Indiv.",
  /** The brand as the header lockup writes it ("dan tech"). */
  shortName: "Dan Tech",
  founder: "Danh Tran",
  url: "https://dantech.app",
  email: "admin@dantech.app",
  description:
    "A one-person studio from Vietnam. Every app designed, coded and shipped by the same pair of hands.",
} as const;

export const storeLinks = {
  duolyGooglePlay: "https://play.google.com/store/apps/details?id=com.creative.lovedays",
  duolyAppStore: "https://apps.apple.com/vn/app/duoly-in-love-relationship-app/id6805425660",
  kimTaiAppStore: "https://apps.apple.com/vn/app/kim-t%C3%A0i-gi%C3%A1-v%C3%A0ng-online/id6798353852",
  kimTaiGooglePlay: "https://play.google.com/store/apps/details?id=com.creative.kimtai.tichvang",
  blockPuzzleGooglePlay: "https://play.google.com/store/apps/details?id=com.creative.bbpuzzle",
  blockPuzzleAppStore: "https://apps.apple.com/vn/app/block-puzzle-original/id1268716035",
  garageToAgiGooglePlay: "https://play.google.com/store/apps/details?id=com.dantech.idle_ai_lab",
} as const;

export type SocialChannel = {
  name: string;
  handle: string;
  href: string;
};

export const social = {
  telegram: { name: "Telegram", handle: "@dantech0xff", href: "https://t.me/dantech0xff" },
  facebook: { name: "Facebook", handle: "/dantech0xff", href: "https://www.facebook.com/dantech0xff" },
  linkedin: { name: "LinkedIn", handle: "/in/dantech0xff", href: "https://www.linkedin.com/in/dantech0xff/" },
  github: { name: "GitHub", handle: "dantech0xff", href: "https://github.com/dantech0xff" },
  x: { name: "X", handle: "@dan_0xff", href: "https://x.com/dan_0xff" },
  youtube: { name: "YouTube", handle: "Dan Tech", href: "https://www.youtube.com/channel/UCwZM2_v4Y_vMb_JCjEJ15yw" },
} as const satisfies Record<string, SocialChannel>;
