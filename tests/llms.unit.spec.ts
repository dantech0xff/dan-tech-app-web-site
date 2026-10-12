import { expect, test } from "@playwright/test";
import { llmsTxt } from "../src/lib/llms";
import { routes } from "../src/lib/routes";
import { BANNED, NOT_YET } from "./copy-rules";

// Pure builder: no browser page needed.

const text = llmsTxt();
const lines = text.split("\n");

test("llms.txt follows the llmstxt.org layout", () => {
  expect(lines[0]).toBe("# Dan Tech Indiv.");
  expect(lines[2], "a one-line summary as a blockquote").toMatch(/^> .{40,}/);
  expect(lines.filter((line) => line.startsWith("## "))).toEqual(["## Apps", "## Store listings", "## Pages", "## Policies", "## Optional"]);
  expect(text.endsWith("\n")).toBe(true);

  const items = lines.filter((line) => line.startsWith("- "));
  expect(items.length).toBeGreaterThan(10);
  // Every list item is a Markdown link to an absolute https address, with an optional note.
  for (const item of items) expect(item).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .+)?$/);
});

test("llms.txt lists every page of the site", () => {
  for (const path of Object.values(routes)) {
    expect(text, `${path} is missing from llms.txt`).toContain(`](https://dantech.app${path})`);
  }
});

test("llms.txt keeps the email address out, as the structured data does", () => {
  expect(text).not.toMatch(/@dantech\.app/);
  expect(text).not.toMatch(/mailto:/);
});

test("the game's line promises only Coming soon to Google Play and avoids the banned topics", () => {
  const game = lines.find((line) => line.includes("](https://dantech.app/idle-ai-tycoon/)"));
  expect(game).toBeDefined();
  expect(game).toContain("Coming soon to Google Play");
  expect(game).not.toMatch(/\b(iphone|ios|app store)\b/i);
  expect(game).not.toMatch(BANNED);
  expect(game).not.toMatch(NOT_YET);
});
