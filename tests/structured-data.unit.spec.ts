import { expect, test } from "@playwright/test";
import { faqGroups } from "../src/content/faq";
import { pageNames, routes } from "../src/lib/routes";
import { breadcrumbs, faqPage, gamePage, productsGraph, siteGraph, toJsonLd } from "../src/lib/structured-data";

// Pure builders: no browser page needed.

test("JSON-LD text can never close its script tag", () => {
  const data = { name: "</script><script>alert(1)</script>", also: "a < b" };
  const text = toJsonLd(data);
  expect(text).not.toContain("</script>");
  expect(text).not.toContain("<");
  // Escaped, not lost: reading it back gives the original values.
  expect(JSON.parse(text)).toEqual(data);
});

test("the site graph ties the website to the studio and lists only https profiles", () => {
  const [organization, website] = siteGraph()["@graph"];
  expect(organization["@type"]).toBe("Organization");
  expect(website["@type"]).toBe("WebSite");
  expect(website.publisher).toEqual({ "@id": organization["@id"] });
  expect(organization["@id"]).toMatch(/^https:\/\/dantech\.app\/#organization$/);
  const profiles = organization.sameAs as string[];
  expect(profiles.length).toBeGreaterThanOrEqual(3);
  for (const url of profiles) expect(url).toMatch(/^https:\/\//);
});

test("every page has a breadcrumb name, and a breadcrumb is Home then the page", () => {
  for (const path of Object.values(routes)) {
    expect(pageNames[path], `${path} needs a name in pageNames`).toBeTruthy();
    if (path === routes.home) continue;
    const trail = breadcrumbs(path).itemListElement;
    expect(trail.map((entry) => entry.position)).toEqual([1, 2]);
    expect(trail.map((entry) => entry.item)).toEqual(["https://dantech.app/", `https://dantech.app${path}`]);
    expect(trail[1].name).toBe(pageNames[path]);
  }
});

test("the products graph describes both apps with their store listings", () => {
  const apps = productsGraph()["@graph"];
  expect(apps.map((app) => app["@type"])).toEqual(["MobileApplication", "MobileApplication"]);
  for (const app of apps) {
    expect(app.sameAs).toEqual(expect.arrayContaining([expect.stringContaining("play.google.com"), expect.stringContaining("apps.apple.com")]));
    // Free to download, as the FAQ says.
    expect(app.offers).toMatchObject({ "@type": "Offer", price: "0" });
  }
});

test("the FAQ markup has one question for each visible question", () => {
  const questions = faqPage().mainEntity.map((question) => question.name);
  expect(questions).toEqual(faqGroups.flatMap((group) => group.items.map((item) => item.q)));
});

test("the game's markup links its Google Play listing and claims no price, offer or rating", () => {
  const game = gamePage() as Record<string, unknown>;
  expect(game["@type"]).toBe("VideoGame");
  expect(game.sameAs).toEqual(["https://play.google.com/store/apps/details?id=com.dantech.idle_ai_lab"]);
  expect(game.installUrl).toBe("https://play.google.com/store/apps/details?id=com.dantech.idle_ai_lab");
  for (const key of ["offers", "aggregateRating", "review", "isAccessibleForFree", "datePublished"]) {
    expect(game, `${key} says more than the page does`).not.toHaveProperty(key);
  }
});
