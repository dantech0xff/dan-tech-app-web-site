#!/usr/bin/env node
// Downloads the Material Symbols Outlined subset the site renders into
// public/fonts/, so no request goes to Google at runtime. Run `npm run icons:update`
// after adding or removing an icon name anywhere in src/.
import { mkdir, writeFile } from "node:fs/promises";

const ICONS = [
  "add", "add_reaction", "arrow_forward", "arrow_outward", "article", "auto_stories", "battery_full",
  "celebration", "check_circle", "code", "favorite", "forum", "groups", "mark_email_read", "menu_book",
  "palette", "phonelink_lock", "remove", "school", "send", "signal_cellular_alt", "trending_up", "widgets",
  "wifi",
];
// Same axes as the design's Google Fonts request, so glyphs render identically.
const AXES = "opsz,wght,FILL,GRAD@20..48,300..500,0..1,0";
const OUT = new URL("../public/fonts/material-symbols-outlined.woff2", import.meta.url);
// Google Fonts picks the font format from the user agent; a current Chrome gets WOFF2.
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

// The Google Fonts API expects icon_names in alphabetical order.
const cssUrl =
  `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:${AXES}` +
  `&icon_names=${[...ICONS].sort().join(",")}&display=block`;

const cssResponse = await fetch(cssUrl, { headers: { "User-Agent": USER_AGENT } });
if (!cssResponse.ok) throw new Error(`Google Fonts CSS request failed: ${cssResponse.status}`);
const css = await cssResponse.text();
const fontUrl = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1];
if (!fontUrl) throw new Error(`No WOFF2 source in the Google Fonts response:\n${css}`);

const fontResponse = await fetch(fontUrl);
if (!fontResponse.ok) throw new Error(`Font download failed: ${fontResponse.status}`);
const font = Buffer.from(await fontResponse.arrayBuffer());

await mkdir(new URL(".", OUT), { recursive: true });
await writeFile(OUT, font);
console.log(`Saved ${ICONS.length} icons (${font.length} bytes) to public/fonts/material-symbols-outlined.woff2`);
