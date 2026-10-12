import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { routes } from "../src/lib/routes";

// Search-engine basics, checked on every page the sitemap lists, so a new route is covered as soon as it is added.

const ORIGIN = "https://dantech.app";

async function sitemapUrls(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

/** The page's own path: sitemap URLs name the production origin, the tests run on localhost. */
const pathOf = (url: string) => new URL(url).pathname;

type Node = { "@type"?: string; "@id"?: string; [property: string]: unknown };

/** Every JSON-LD block of the page, parsed, with `@graph` members flattened into one list. */
async function structuredData(page: Page): Promise<{ blocks: Node[]; nodes: Node[] }> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const blocks: Node[] = texts.map((text) => JSON.parse(text));
  const nodes = blocks.flatMap((block) => (Array.isArray(block["@graph"]) ? (block["@graph"] as Node[]) : [block]));
  return { blocks, nodes };
}

test("the sitemap lists every route once, as the canonical address", async ({ request }) => {
  const urls = await sitemapUrls(request);
  expect(urls).toEqual([...new Set(urls)]);
  expect([...urls].sort()).toEqual(Object.values(routes).map((path) => ORIGIN + path).sort());
});

test("robots.txt lets search engines in and names the sitemap", async ({ request }) => {
  const text = await (await request.get("/robots.txt")).text();
  expect(text).toMatch(/^Allow: \/$/m);
  expect(text).not.toMatch(/^Disallow: \/\s*$/m);
  expect(text).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
});

test("llms.txt is UTF-8 text and every link to this site resolves", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain; charset=utf-8/i);
  const text = await response.text();
  expect(text, "accented letters must survive").toContain("Kim Tài");
  const own = [...text.matchAll(/\]\((https:\/\/dantech\.app[^)\s]*)\)/g)].map((match) => match[1]);
  expect(own.length).toBeGreaterThan(8);
  for (const url of own) {
    expect((await request.get(pathOf(url))).status(), `${url} should answer 200`).toBe(200);
  }
});

test("every sitemap page is live and names itself as the canonical address", async ({ page, request }) => {
  for (const url of await sitemapUrls(request)) {
    expect((await request.get(pathOf(url))).status(), `${url} should answer 200`).toBe(200);
    await page.goto(pathOf(url));
    await expect(page.locator('link[rel="canonical"]'), url).toHaveAttribute("href", url);
  }
});

test("titles, descriptions and share tags are complete, consistent and unique", async ({ page, request }) => {
  const titles = new Map<string, string>();
  for (const url of await sitemapUrls(request)) {
    await page.goto(pathOf(url));
    const title = await page.title();
    const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    const share = async (property: string) => (await page.locator(`meta[property="${property}"]`).getAttribute("content")) ?? "";

    expect(title.length, `${url} title length`).toBeGreaterThanOrEqual(10);
    expect(title.length, `${url} title length`).toBeLessThanOrEqual(65);
    expect(description.length, `${url} description length`).toBeGreaterThanOrEqual(50);
    expect(description.length, `${url} description length`).toBeLessThanOrEqual(160);
    expect(await share("og:title"), `${url} og:title`).toBe(title);
    expect(await share("og:description"), `${url} og:description`).toBe(description);
    expect(await share("og:url"), `${url} og:url`).toBe(url);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /\bindex\b/);

    const image = await share("og:image");
    expect(image, `${url} og:image`).toMatch(/^https:\/\//);
    expect((await request.get(pathOf(image))).status(), `${image} should answer 200`).toBe(200);

    expect(titles.has(title), `${url} repeats the title of ${titles.get(title)}`).toBe(false);
    titles.set(title, url);
  }
});

test("the 404 page stays out of search results and out of the sitemap", async ({ page, request }) => {
  await page.goto("/no-such-page");
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  expect(await sitemapUrls(request)).not.toContain(`${ORIGIN}/no-such-page/`);
});

test("every page carries valid structured data that points at the studio", async ({ page, request }) => {
  for (const url of await sitemapUrls(request)) {
    await page.goto(pathOf(url));
    const { blocks, nodes } = await structuredData(page);

    for (const block of blocks) expect(block["@context"], `${url} block context`).toBe("https://schema.org");

    const organization = nodes.find((node) => node["@type"] === "Organization");
    const website = nodes.find((node) => node["@type"] === "WebSite");
    expect(organization, `${url} Organization`).toBeDefined();
    expect(website, `${url} WebSite`).toBeDefined();
    expect(organization).toMatchObject({ name: "Dan Tech Indiv.", url: `${ORIGIN}/` });
    expect((organization!.sameAs as string[]).length).toBeGreaterThanOrEqual(3);
    expect((await request.get(pathOf(organization!.logo as string))).status(), "logo should answer 200").toBe(200);
    expect(website!.publisher).toEqual({ "@id": organization!["@id"] });

    // Every reference by @id lands on a node defined on the same page.
    const defined = new Set(nodes.map((node) => node["@id"]).filter(Boolean));
    const references = JSON.stringify(blocks).match(/\{"@id":"[^"]+"\}/g) ?? [];
    for (const reference of references) {
      expect(defined.has(JSON.parse(reference)["@id"]), `${url} refers to ${reference} but never defines it`).toBe(true);
    }

    // Inner pages: a trail of Home, then the page, named like its title.
    if (url !== `${ORIGIN}/`) {
      const trail = nodes.find((node) => node["@type"] === "BreadcrumbList");
      expect(trail, `${url} BreadcrumbList`).toBeDefined();
      const items = trail!.itemListElement as { position: number; name: string; item: string }[];
      expect(items.map((entry) => entry.item)).toEqual([`${ORIGIN}/`, url]);
      expect((await page.title()).startsWith(items[1].name), `${url} breadcrumb "${items[1].name}" should start its title`).toBe(true);
    }
  }
});

test("the products page describes both apps", async ({ page }) => {
  await page.goto(routes.products);
  const apps = (await structuredData(page)).nodes.filter((node) => node["@type"] === "MobileApplication");
  expect(apps.map((app) => app.name)).toEqual(["Duoly in Love", "Kim Tài · Tick Vàng Online"]);
  for (const app of apps) {
    // Each entry is the section the visitor lands on, and its name is the visible heading.
    await expect(page.getByRole("heading", { name: app.name as string })).toBeVisible();
    expect(String(app["@id"]).startsWith(`${ORIGIN}${routes.products}#`)).toBe(true);
    expect((app.sameAs as string[]).some((link) => link.includes("play.google.com"))).toBe(true);
    expect((app.sameAs as string[]).some((link) => link.includes("apps.apple.com"))).toBe(true);
  }
});

test("the FAQ markup matches the questions on the page", async ({ page }) => {
  await page.goto(routes.faq);
  const faq = (await structuredData(page)).nodes.find((node) => node["@type"] === "FAQPage");
  const questions = (faq!.mainEntity as { name: string }[]).map((question) => question.name);
  expect(questions.length).toBeGreaterThan(5);
  for (const question of questions) {
    await expect(page.getByRole("button", { name: question, exact: true }), question).toBeVisible();
  }
});

test("the game page describes the game and nothing it does not promise", async ({ page }) => {
  await page.goto(routes.idleAiTycoon);
  const game = (await structuredData(page)).nodes.find((node) => node["@type"] === "VideoGame");
  expect(game).toMatchObject({ name: "Garage to AGI", url: `${ORIGIN}${routes.idleAiTycoon}`, operatingSystem: "Android" });
  expect(Object.keys(game!)).not.toEqual(expect.arrayContaining(["offers"]));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(String(game!.name));
});
