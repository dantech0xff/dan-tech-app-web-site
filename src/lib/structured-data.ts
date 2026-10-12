import { faqGroups } from "@/content/faq";
import { game } from "@/content/idle-ai-tycoon";
import { apps } from "@/content/products";
import { site, social, storeLinks } from "@/content/site";
import { pageNames, productAnchors, routes, type SitePath } from "./routes";

/*
 * Structured data (schema.org JSON-LD) for search engines. Every builder reads the site's own content and runs while
 * the pages are generated, so the markup is in the static HTML and always says what the page says. Keep it to facts
 * the pages state: no ratings or counts, and no offer for the game (it is not out yet).
 */

type JsonLdNode = { "@type": string; "@id"?: string; [property: string]: unknown };

/** Absolute URL of a site path or asset. */
const abs = (path: string) => new URL(path, site.url).toString();

const ORGANIZATION_ID = abs("/#organization");
const WEBSITE_ID = abs("/#website");
const organization = { "@id": ORGANIZATION_ID };

function graph(...nodes: JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** JSON-LD as text for a `<script>` tag: "<" is escaped so no value can close the tag early. */
export function toJsonLd(data: object): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

/** The studio and the site, on every page so each page's markup can refer to them. */
export function siteGraph() {
  return graph(
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: site.name,
      alternateName: site.shortName,
      url: abs("/"),
      logo: abs("/assets/dantech-mark.png"),
      description: site.description,
      founder: { "@type": "Person", name: site.founder },
      // No email address in the markup on purpose: the live site's host hides it from scrapers in the page, and
      // plain text here would undo that. The contact page carries it.
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: abs(routes.contact) },
      sameAs: Object.values(social).map((channel) => channel.href),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: site.name,
      alternateName: site.shortName,
      url: abs("/"),
      inLanguage: "en",
      publisher: organization,
    },
  );
}

/** Home, then the page: the trail search results can show under the page's link. */
export function breadcrumbs(path: SitePath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [routes.home, path].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pageNames[item],
      item: abs(item),
    })),
  };
}

function mobileApp(
  anchor: string,
  app: { name: string; pitch: string; icon: string; category: string },
  stores: string[],
): JsonLdNode {
  const url = abs(`${routes.products}#${anchor}`);
  return {
    "@type": "MobileApplication",
    "@id": url,
    name: app.name,
    description: app.pitch,
    url,
    image: abs(app.icon),
    applicationCategory: app.category,
    operatingSystem: "Android, iOS",
    // The FAQ says both apps are free to download; the optional Premium tier is bought in the app.
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: organization,
    sameAs: stores,
  };
}

/** The two apps of the products page, with their store listings. */
export function productsGraph() {
  return graph(
    mobileApp(productAnchors.duoly, apps.duoly, [storeLinks.duolyGooglePlay, storeLinks.duolyAppStore]),
    mobileApp(productAnchors.kimTai, apps.kimTai, [storeLinks.kimTaiGooglePlay, storeLinks.kimTaiAppStore]),
  );
}

/** Every question and answer of the FAQ page. */
export function faqPage() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups
      .flatMap((group) => group.items)
      .map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

/** The game's page. No offers or ratings: it is not out yet, and the page promises only "Coming soon to Google Play". */
export function gamePage() {
  const url = abs(routes.idleAiTycoon);
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "@id": `${url}#game`,
    name: game.titleLines.join(" "),
    alternateName: game.title,
    description: game.description,
    url,
    mainEntityOfPage: url,
    image: abs(game.shareImage.url),
    genre: game.genres,
    applicationCategory: "GameApplication",
    operatingSystem: "Android",
    inLanguage: "en",
    publisher: organization,
  };
}
