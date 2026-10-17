import { game } from "@/content/idle-ai-tycoon";
import { pageDescriptions } from "@/content/pages";
import { apps } from "@/content/products";
import { site, storeLinks } from "@/content/site";
import { pageNames, productAnchors, routes, type SitePath } from "./routes";

/*
 * llms.txt (llmstxt.org): a short Markdown guide to the site for language models and the tools that read the web for
 * them. Like the sitemap and the structured data it is built from the site's own content when the site is built, so
 * it cannot drift from the pages. Keep Garage to AGI's line under the same rules as its page (no ads, purchases or
 * upgrades, nothing the app lacks, Google Play only), and keep the email address out: the live site's host hides it
 * from scrapers in the page, and plain text here would undo that. 1010! has no page, so its line links its listing.
 */

const abs = (path: string) => new URL(path, site.url).toString();

const link = (name: string, url: string, note?: string) => `- [${name}](${url})${note ? `: ${note}` : ""}`;

/** A page of the site, described like its meta description. */
const page = (path: SitePath, name: string = pageNames[path]) => link(name, abs(path), pageDescriptions[path]);

export function llmsTxt(): string {
  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} ("${site.shortName}") is an independent software studio from Vietnam founded by ${site.founder}. Its mobile apps are on Google Play and the App Store. This site presents the apps, the studio and its policies.`,
    "",
    "## Apps",
    "",
    link(apps.duoly.name, abs(`${routes.products}#${productAnchors.duoly}`), `${apps.duoly.pitch} Android and iOS.`),
    link(apps.kimTai.name, abs(`${routes.products}#${productAnchors.kimTai}`), `${apps.kimTai.pitch} Android and iOS.`),
    link(game.title, abs(routes.idleAiTycoon), `${game.description} ${game.status}.`),
    link(apps.blockPuzzle.name, storeLinks.blockPuzzleGooglePlay, `${apps.blockPuzzle.pitch} Android and iOS.`),
    "",
    "## Store listings",
    "",
    link(`${apps.duoly.name} on Google Play`, storeLinks.duolyGooglePlay),
    link(`${apps.duoly.name} on the App Store`, storeLinks.duolyAppStore),
    link(`${apps.kimTai.name} on Google Play`, storeLinks.kimTaiGooglePlay),
    link(`${apps.kimTai.name} on the App Store`, storeLinks.kimTaiAppStore),
    link(`${game.title} on Google Play`, storeLinks.garageToAgiGooglePlay),
    link(`${apps.blockPuzzle.name} on Google Play`, storeLinks.blockPuzzleGooglePlay),
    link(`${apps.blockPuzzle.name} on the App Store`, storeLinks.blockPuzzleAppStore),
    "",
    "## Pages",
    "",
    page(routes.home, "Home"),
    page(routes.products),
    page(routes.about),
    page(routes.faq),
    page(routes.contact),
    "",
    "## Policies",
    "",
    page(routes.privacy),
    page(routes.terms),
    "",
    "## Optional",
    "",
    link("Sitemap", abs("/sitemap.xml"), "Every page of the site."),
    "",
  ].join("\n");
}
