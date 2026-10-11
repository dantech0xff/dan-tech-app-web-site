// Trailing slashes match `trailingSlash: true` in next.config.ts.
export const routes = {
  home: "/",
  products: "/products/",
  about: "/about/",
  contact: "/contact/",
  faq: "/faq/",
  privacy: "/privacy/",
  terms: "/terms/",
} as const;

export type SitePath = (typeof routes)[keyof typeof routes];

/** Section ids on /products that the rest of the site deep-links into. */
export const productAnchors = {
  duoly: "duoly",
  kimTai: "kim-tai",
  academy: "academy",
  earlier: "earlier",
} as const;

/** Compares paths regardless of a trailing slash ("/about" equals "/about/"). */
export function isSamePath(a: string, b: string): boolean {
  const strip = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
  return strip(a) === strip(b);
}
