import { expect, test, type Page } from "@playwright/test";
import { BANNED, NOT_YET } from "./copy-rules";

const PAGES = [
  { path: "/", title: /Apps make life more convenient/, heading: "Apps make life more convenient." },
  { path: "/products/", title: /^Products · Dan Tech Indiv\.$/, heading: "Every app, built end-to-end by one person." },
  { path: "/about/", title: /^About · Dan Tech Indiv\.$/, heading: "One person, all the way through." },
  { path: "/contact/", title: /^Contact · Dan Tech Indiv\.$/, heading: "Talk to Dan." },
  { path: "/faq/", title: /^FAQ · Dan Tech Indiv\.$/, heading: "Quick answers." },
  { path: "/privacy/", title: /^Privacy Policy · Dan Tech Indiv\.$/, heading: "Privacy Policy" },
  { path: "/terms/", title: /^Terms of Service · Dan Tech Indiv\.$/, heading: "Terms of Service" },
  { path: "/idle-ai-tycoon/", title: /^Garage to AGI: Idle AI Tycoon · Dan Tech Indiv\.$/, heading: "Garage to AGI" },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

/** Waits until smooth scrolling has come to rest. */
async function scrollSettled(page: Page) {
  await expect
    .poll(async () => {
      const first = await page.evaluate(() => window.scrollY);
      await page.waitForTimeout(120);
      return first === (await page.evaluate(() => window.scrollY));
    })
    .toBe(true);
}

/** A section opened by link or hash sits 72px from the top on desktop, just under the header when it wraps. */
async function expectSectionBelowHeader(page: Page, id: string) {
  const { top, headerBottom } = await page.evaluate((sectionId) => {
    const header = document.querySelector("[data-site-header]")!.getBoundingClientRect();
    return { top: document.getElementById(sectionId)!.getBoundingClientRect().top, headerBottom: header.bottom };
  }, id);
  expect(top).toBeGreaterThanOrEqual(headerBottom);
  expect(Math.abs(top - Math.max(72, headerBottom + 3))).toBeLessThanOrEqual(2);
}

/** Records mailto: navigations, which the browser hands to the OS mail app. */
function captureMailto(page: Page) {
  const urls: string[] = [];
  page.on("request", (request) => {
    if (request.url().startsWith("mailto:")) urls.push(request.url());
  });
  return urls;
}

for (const { path, title, heading } of PAGES) {
  test(`${path} renders its heading without console errors`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.locator("footer")).toContainText("Made in Vietnam · one person, all the way through");
    // The site presents the mobile apps only; the Academy is not part of it.
    await expect(page.locator("body")).not.toContainText(/academy/i);
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute("content", /academy/i);
    expect(errors).toEqual([]);
  });
}

// Small Android phones, the most common Android width, iPhone SE/mini and iPhone 12–16.
for (const width of [320, 360, 375, 390]) {
  test(`no page scrolls sideways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const { path } of PAGES) {
      await page.goto(path);
      // Fallback fonts are wider (icons show their names), so measure only once the real ones are in.
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect.soft(overflow, `${path} is ${overflow}px wider than the screen`).toBe(0);
    }
  });
}

test("pages hydrate cleanly after the build year has passed", async ({ page }) => {
  await page.clock.setFixedTime(new Date(new Date().getFullYear() + 1, 0, 2));
  const errors = collectErrors(page);
  await page.goto("/about/");
  await expect(page.locator("footer")).toContainText(`© ${new Date().getFullYear() + 1} Dan Tech Indiv.`);
  expect(errors).toEqual([]);
});

test("each page shares its own title and URL", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "About · Dan Tech Indiv.");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://dantech.app/about/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://dantech.app/about/");
});

test("header marks the current page", async ({ page }) => {
  await page.goto("/about/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "About", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Products", exact: true })).not.toHaveAttribute("aria-current");
});

test("a product card opens its section just below the sticky header", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Kim Tài · Tick Vàng Online/ }).first().click();
  await expect(page).toHaveURL(/\/products\/#kim-tai$/);
  await scrollSettled(page);
  await expectSectionBelowHeader(page, "kim-tai");
});

test("a link to the current page scrolls in place", async ({ page }) => {
  await page.goto("/products/");
  await page.getByRole("link", { name: "Earlier work" }).first().click();
  await expect(page).toHaveURL(/\/products\/#earlier$/);
  await scrollSettled(page);
  await expectSectionBelowHeader(page, "earlier");
});

test("opening a section URL directly clears the header", async ({ page }) => {
  await page.goto("/products/#kim-tai");
  await scrollSettled(page);
  await expectSectionBelowHeader(page, "kim-tai");
});

test("with reduced motion, in-page jumps happen without animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products/");
  await page.getByRole("link", { name: "Kim Tài", exact: true }).click();
  await page.waitForTimeout(50);
  await expectSectionBelowHeader(page, "kim-tai");
});

test("another page opens at the top", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("One person, all the way through.");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("FAQ keeps at most one answer open", async ({ page }) => {
  await page.goto("/faq/");
  const first = page.getByRole("button", { name: "What is Dan Tech Indiv.?" });
  const second = page.getByRole("button", { name: "Are the apps free?" });

  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("An independent, one-person software studio")).toBeVisible();

  await second.click();
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("An independent, one-person software studio")).toHaveCount(0);
  await expect(page.getByText("Each has an optional Premium tier")).toBeVisible();

  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "false");
});

test("contact form opens a prefilled email and confirms", async ({ page }) => {
  const mailto = captureMailto(page);
  await page.goto("/contact/");
  await page.getByLabel("NAME").fill("Linh");
  await page.getByLabel("EMAIL").fill("linh@example.com");
  await page.getByLabel("TOPIC").selectOption("Press");
  await page.getByLabel("MESSAGE").fill("Interview request");
  await page.getByRole("button", { name: /Send message/ }).click();

  const confirmation = page.getByRole("status");
  await expect(confirmation).toContainText("Your mail app should be open with the message ready.");
  await expect(confirmation).toBeFocused();
  await expect.poll(() => mailto.length).toBe(1);
  const url = new URL(mailto[0]);
  expect(url.pathname).toBe("admin@dantech.app");
  expect(url.searchParams.get("subject")).toBe("[dantech.app] Press — Linh");
  expect(url.searchParams.get("body")).toBe("Interview request\r\n\r\n— Linh <linh@example.com>");

  await page.getByRole("button", { name: "Write another" }).click();
  await expect(page.getByLabel("NAME")).toBeFocused();
});

test("newsletter falls back to an email request without an endpoint", async ({ page }) => {
  test.skip(!!process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT, "build uses a real newsletter endpoint");
  const mailto = captureMailto(page);
  await page.goto("/");
  await page.getByRole("textbox", { name: "Email address" }).fill("reader@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();

  const confirmation = page.getByRole("status");
  await expect(confirmation).toContainText("Your mail app should be open with the request ready");
  await expect(confirmation).toBeFocused();
  await expect.poll(() => mailto.length).toBe(1);
  expect(new URL(mailto[0]).searchParams.get("body")).toBe("Please add reader@example.com to the Ship notes list.");
});

test.describe("Garage to AGI page", () => {
  const GAME = "/idle-ai-tycoon/";

  test("shares the game's card, title and URL", async ({ page }) => {
    await page.goto(GAME);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Garage to AGI: Idle AI Tycoon · Dan Tech Indiv.",
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://dantech.app/idle-ai-tycoon/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://dantech.app/idle-ai-tycoon/");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://dantech.app/assets/share/idle-ai-tycoon.png",
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      "https://dantech.app/assets/share/idle-ai-tycoon.png",
    );
  });

  test("other pages share the studio's card", async ({ page }) => {
    await page.goto("/about/");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://dantech.app/assets/share/site.jpg");
  });

  test("is listed in the sitemap", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(await response.text()).toContain("<loc>https://dantech.app/idle-ai-tycoon/</loc>");
  });

  test("says the game is not out yet, links no store and promises nothing more", async ({ page }) => {
    await page.goto(GAME);
    await expect(page.getByText("Coming soon to Google Play")).toBeVisible();
    await expect(page.locator("main a[href*='play.google.com'], main a[href*='apps.apple.com']")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/\b(iphone|ios|app store)\b/i);
  });

  test("never mentions ads, purchases or upgrades, nor features the app lacks", async ({ page }) => {
    await page.goto(GAME);
    // The studio newsletter that closes the page is the only form; it is not the game's copy, so it is left out.
    const sections = page.locator("main > section:not(:has(form))");
    const text = (await sections.allInnerTexts()).join("\n");
    const images = sections.locator("img");
    const alts = (await images.evaluateAll((list) => list.map((image) => image.getAttribute("alt") ?? ""))).filter(Boolean);
    const files = await images.evaluateAll((list) => list.map((image) => image.getAttribute("src") ?? ""));
    const labels = await sections.locator("[aria-label]").evaluateAll((list) => list.map((element) => element.getAttribute("aria-label") ?? ""));
    const meta = await page.evaluate(() => [
      document.title,
      ...[...document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')].map(
        (tag) => tag.getAttribute("content") ?? "",
      ),
    ]);
    // The structured data is public metadata too: the same words must stay out of it.
    const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    // Guards against checking nothing: the page is much bigger than this.
    expect(text.length).toBeGreaterThan(4000);
    expect(jsonLd.length).toBeGreaterThan(1500);
    expect(alts.length).toBeGreaterThan(15);
    expect(files.length).toBeGreaterThan(40);
    expect(meta.length).toBeGreaterThan(5);

    const surfaces = { text, alts: alts.join("\n"), labels: labels.join("\n"), files: files.join("\n"), meta: meta.join("\n"), jsonLd };
    for (const [name, value] of Object.entries(surfaces)) {
      expect(value, `${name} mentions a banned topic`).not.toMatch(BANNED);
      expect(value, `${name} mentions a feature the app lacks`).not.toMatch(NOT_YET);
    }
  });

  test("the hero link jumps to the gameplay section below the sticky header", async ({ page }) => {
    await page.goto(GAME);
    await page.getByRole("link", { name: /See how it plays/ }).click();
    await expect(page).toHaveURL(/\/idle-ai-tycoon\/#gameplay$/);
    await scrollSettled(page);
    await expectSectionBelowHeader(page, "gameplay");
  });

  test("every picture and the pixel font are served", async ({ page, request }) => {
    await page.goto(GAME);
    const sources = await page.evaluate(() => [...new Set([...document.images].map((image) => image.getAttribute("src") ?? ""))]);
    expect(sources.length).toBeGreaterThan(40);
    // The share card uses the full-size icon, which no <img> shows.
    for (const src of [...sources, "/assets/idle-ai-tycoon/icon-512.png", "/fonts/jersey-10.woff2"]) {
      const response = await request.get(src);
      expect(response.status(), `${src} did not load`).toBe(200);
    }
  });

  test("pixel art is drawn with hard edges and the title uses the pixel font", async ({ page }) => {
    await page.goto(GAME);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const scene = page.getByRole("img", { name: /Pixel-art garage lab/ }).first();
    await expect(scene).toHaveCSS("image-rendering", "pixelated");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("font-family", /Jersey 10/);
    const loaded = await page.evaluate(() => [...document.fonts].some((font) => font.family.includes("Jersey 10") && font.status === "loaded"));
    expect(loaded, "Jersey 10 should be downloaded and in use").toBe(true);
  });

  test("the pixel font is preloaded on this page only", async ({ page }) => {
    await page.goto(GAME);
    // Without `crossorigin` a font preload is fetched twice.
    await expect(
      page.locator('head link[rel="preload"][as="font"][type="font/woff2"][crossorigin][href="/fonts/jersey-10.woff2"]'),
    ).toHaveCount(1);
    await page.goto("/");
    await expect(page.locator('link[href="/fonts/jersey-10.woff2"]')).toHaveCount(0);
  });

  test("the loss-spike picture and the hidden minds have text for assistive tech", async ({ page }) => {
    await page.goto(GAME);
    const picture = page.getByRole("img", { name: /LOSS SPIKE!.*ROLL BACK: Safe: lose 8% progress.*PUSH THROUGH: 50%: \+3 BENCH/ });
    await expect(picture).toBeVisible();
    // Three minds are still hidden; each is announced as not found yet, not as "???".
    await expect(page.getByText("Not found yet.")).toHaveCount(3);
  });
});

test("unknown paths get the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found.");
});
