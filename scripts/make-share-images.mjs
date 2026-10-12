#!/usr/bin/env node
// Renders the share images (the Open Graph and Twitter cards, 1200x630) from the HTML templates in
// scripts/share-images/, with the project's Playwright Chromium, into public/assets/share/. Run
// `npm run share-images` after changing a template or the art it uses, then commit the PNGs.
// Needs the network, like scripts/update-icon-font.mjs: the templates load Be Vietnam Pro and IBM Plex Mono
// from Google Fonts while they render. The built site never does.
import { mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const WIDTH = 1200;
const HEIGHT = 630;

// Cards are kept under 300 KB, the size some apps (WhatsApp, for one) still ask for. The studio card has gradients and
// app screenshots, so it is a high-quality JPEG; the game card is flat pixel art, which only PNG keeps sharp.
const IMAGES = [
  { template: "share-images/site.html", out: "../public/assets/share/site.jpg", options: { type: "jpeg", quality: 90 } },
  { template: "share-images/game.html", out: "../public/assets/share/idle-ai-tycoon.png", options: { type: "png" } },
];

const here = (path) => new URL(path, import.meta.url);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  for (const { template, out, options } of IMAGES) {
    await page.goto(here(template).href, { waitUntil: "networkidle" });
    // Fonts and every picture must be in before the shot, or the card would show fallbacks and gaps.
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    const file = fileURLToPath(here(out));
    await mkdir(new URL(".", here(out)), { recursive: true });
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT }, ...options });
    console.log(`Saved ${pathToFileURL(file).pathname.replace(`${process.cwd()}/`, "")}`);
  }
} finally {
  await browser.close();
}
