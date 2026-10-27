import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { routes } from "../src/lib/routes";

// The Cloudflare Worker's rule files (public/_redirects, public/_headers): pure text checks, no browser page needed.

const rules = (file: string) =>
  readFileSync(join(__dirname, "..", "public", file), "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));

test("every folder route answers its slash-less URL with a 301", () => {
  const redirects = rules("_redirects").map((line) => line.trim().split(/\s+/));
  const expected = Object.values(routes)
    .filter((path) => path !== routes.home)
    .map((path) => [path.replace(/\/$/, ""), path, "301"]);
  expect(redirects).toEqual(expected);
});

test("hashed bundles and fonts are cached as immutable, and the root text files say they are UTF-8", () => {
  const utf8 = (path: string) => [path, "  Content-Type: text/plain; charset=utf-8"];
  expect(rules("_headers")).toEqual([
    "/_next/static/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "/fonts/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    ...utf8("/llms.txt"),
    ...utf8("/robots.txt"),
    ...utf8("/app-ads.txt"),
  ]);
});
