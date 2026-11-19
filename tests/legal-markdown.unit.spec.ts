import { expect, test } from "@playwright/test";
import { garageToAgiPrivacy } from "../src/content/garage-to-agi-privacy";
import { parseBlocks, parseInline, parseLegalText } from "../src/lib/legal-markdown";

test("Garage to AGI's policy is published whole: sections 1 to 15, no blanks, no notes for the owner", () => {
  const policy = parseLegalText(garageToAgiPrivacy);
  expect(policy.title).toBe("Privacy Policy: Garage to AGI");
  expect(policy.sections.map((section) => Number.parseInt(section.title, 10))).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
  expect(garageToAgiPrivacy).not.toMatch(/TO BE COMPLETED|Notes for the owner|not part of the published text/);
  expect(garageToAgiPrivacy).toMatch(/^# Privacy Policy: Garage to AGI\n\nLast updated: \d{1,2} \w+ \d{4}\n/);
  const tables = policy.sections.flatMap((section) => section.blocks.filter((block) => block.kind === "table"));
  expect(tables).toHaveLength(4);
  for (const table of tables) {
    if (table.kind !== "table") continue;
    for (const row of table.rows) expect(row).toHaveLength(table.head.length);
  }
});

test("list items keep their wrapped lines, nested lists and later paragraphs", () => {
  const [list] = parseBlocks([
    "- First item that",
    "  wraps.",
    "- Second item:",
    "  - nested one",
    "    goes on",
    "  - nested two",
    "",
    "  Back in the second item.",
    "",
    "A paragraph after the list.",
  ]);
  expect(list.kind).toBe("list");
  if (list.kind !== "list") return;
  expect(list.items).toHaveLength(2);
  expect(list.items[0]).toEqual([{ kind: "paragraph", content: [{ kind: "text", text: "First item that wraps." }] }]);
  const second = list.items[1];
  expect(second.map((block) => block.kind)).toEqual(["paragraph", "list", "paragraph"]);
  const nested = second[1];
  if (nested.kind === "list") expect(nested.items[0][0]).toEqual({ kind: "paragraph", content: [{ kind: "text", text: "nested one goes on" }] });
});

test("inline marks, addresses and emails; nothing else becomes markup", () => {
  expect(parseInline("**Bold.** see (https://db-ip.com), `com.x` or admin@dantech.app. <b>x</b>")).toEqual([
    { kind: "strong", text: "Bold." },
    { kind: "text", text: " see (" },
    { kind: "url", text: "https://db-ip.com" },
    { kind: "text", text: "), " },
    { kind: "code", text: "com.x" },
    { kind: "text", text: " or " },
    { kind: "email", text: "admin@dantech.app" },
    { kind: "text", text: ". <b>x</b>" },
  ]);
});
