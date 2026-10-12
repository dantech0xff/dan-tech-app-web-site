import { routes, type SitePath } from "@/lib/routes";
import { game } from "./idle-ai-tycoon";
import { site } from "./site";

/** What each page is about: its description in search results and its line in llms.txt. */
export const pageDescriptions = {
  [routes.home]: site.description,
  [routes.products]: "Duoly in Love, Kim Tài · Tick Vàng Online and more — mobile apps built end-to-end by one person.",
  [routes.about]:
    "Dan Tech Indiv. is an independent software studio from Vietnam. One founder designs, builds, ships and supports every product.",
  [routes.contact]: "Partnerships, press, support or hiring. One inbox, read by the person who built the apps.",
  [routes.faq]: "Quick answers about the studio, Duoly in Love, Kim Tài and your account.",
  [routes.privacy]: "How dantech.app and the apps published by Dan Tech Indiv. handle your data.",
  [routes.terms]: "The terms for using dantech.app and the apps published by Dan Tech Indiv.",
  [routes.idleAiTycoon]: game.description,
} satisfies Record<SitePath, string>;
