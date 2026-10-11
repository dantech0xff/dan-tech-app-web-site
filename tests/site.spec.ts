import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  { path: "/", title: /Apps make life more convenient/, heading: "Apps make life more convenient." },
  { path: "/products/", title: /^Products · Dan Tech Indiv\.$/, heading: "Two apps, built end-to-end by one person." },
  { path: "/about/", title: /^About · Dan Tech Indiv\.$/, heading: "One person, all the way through." },
  { path: "/contact/", title: /^Contact · Dan Tech Indiv\.$/, heading: "Talk to Dan." },
  { path: "/faq/", title: /^FAQ · Dan Tech Indiv\.$/, heading: "Quick answers." },
  { path: "/privacy/", title: /^Privacy Policy · Dan Tech Indiv\.$/, heading: "Privacy Policy" },
  { path: "/terms/", title: /^Terms of Service · Dan Tech Indiv\.$/, heading: "Terms of Service" },
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

test("unknown paths get the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found.");
});
