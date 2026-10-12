// The owner's rules for anything the studio says about the game Garage to AGI (its page, its structured data, its line
// in llms.txt). Shared by the specs so the lists live in one place.

/** Ads, purchases, upgrades and the game's own paid-feature words (its x2 "boost" is an ad and subscription perk). */
export const BANNED =
  /\b(ads?|advert\w*|purchas\w*|in-app|iap|subscri\w*|premium|upgrad\w*|paywall|chips?|coins?|gems?|currenc\w*|buy\w*|shop\w*|boost\w*|overclock|founder pass|vc backing|board seat|server uptime|starter pack|free[- ]to[- ]play)\b|\$\d/i;

/** Features the app does not have yet. */
export const NOT_YET = /weekly (deepest[- ]layer )?board|content drops?|titles? other players|new model famil\w*/i;
