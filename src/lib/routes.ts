// Trailing slashes match `trailingSlash: true` in next.config.ts.
export const routes = {
  home: "/",
  products: "/products/",
  about: "/about/",
  contact: "/contact/",
  faq: "/faq/",
  privacy: "/privacy/",
  terms: "/terms/",
  idleAiTycoon: "/idle-ai-tycoon/",
} as const;

export type SitePath = (typeof routes)[keyof typeof routes];

/** Name of each page in breadcrumbs. A page's <title> starts with its name (the home page has its own title). */
export const pageNames = {
  [routes.home]: "Home",
  [routes.products]: "Products",
  [routes.about]: "About",
  [routes.contact]: "Contact",
  [routes.faq]: "FAQ",
  [routes.privacy]: "Privacy Policy",
  [routes.terms]: "Terms of Service",
  [routes.idleAiTycoon]: "Garage to AGI",
} satisfies Record<SitePath, string>;

/** Section ids on /products that the rest of the site deep-links into. */
export const productAnchors = {
  duoly: "duoly",
  kimTai: "kim-tai",
  earlier: "earlier",
} as const;

/** Compares paths regardless of a trailing slash ("/about" equals "/about/"). */
export function isSamePath(a: string, b: string): boolean {
  const strip = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
  return strip(a) === strip(b);
}
