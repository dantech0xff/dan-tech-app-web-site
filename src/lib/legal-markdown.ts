/*
 * The small Markdown subset the game's legal texts are written in, parsed at build time: a "# " title, "## " sections,
 * paragraphs (wrapped lines join with a space), "- " lists whose items continue on lines indented two spaces (and may
 * hold a nested list or a second paragraph), and pipe tables with a separator row. Inline: **bold**, `code`, web
 * addresses and email addresses. Anything else is plain text, so nothing in the source can inject markup.
 */

export type Inline = { kind: "text" | "strong" | "code" | "url" | "email"; text: string };

export type Block =
  | { kind: "paragraph"; content: Inline[] }
  | { kind: "list"; items: Block[][] }
  | { kind: "table"; head: Inline[][]; rows: Inline[][][] };

export type LegalSection = { title: string; blocks: Block[] };

export type LegalText = { title: string; preamble: Block[]; sections: LegalSection[] };

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

export function parseInline(text: string): Inline[] {
  const parts: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: "text", text: text.slice(last, index) });
    if (token.startsWith("**")) parts.push({ kind: "strong", text: token.slice(2, -2) });
    else if (token.startsWith("`")) parts.push({ kind: "code", text: token.slice(1, -1) });
    else if (token.startsWith("http")) {
      // A sentence's full stop or comma right after an address is not part of it.
      const url = token.replace(/[.,;:]+$/, "");
      parts.push({ kind: "url", text: url });
      if (url.length < token.length) parts.push({ kind: "text", text: token.slice(url.length) });
    } else {
      const email = token.replace(/[.]+$/, "");
      parts.push({ kind: "email", text: email });
      if (email.length < token.length) parts.push({ kind: "text", text: token.slice(email.length) });
    }
    last = index + token.length;
  }
  if (last < text.length) parts.push({ kind: "text", text: text.slice(last) });
  return parts;
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => parseInline(cell.trim()));

const isSeparator = (row: string) => /^\|[\s:|-]+\|$/.test(row.trim());

export function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
    } else if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const [head, ...rest] = rows;
      blocks.push({ kind: "table", head: cells(head), rows: rest.filter((row) => !isSeparator(row)).map(cells) });
    } else if (line.startsWith("- ")) {
      const items: Block[][] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        const itemLines = [lines[i++].slice(2)];
        while (i < lines.length) {
          if (lines[i].startsWith("  ")) itemLines.push(lines[i++].slice(2));
          // A blank line inside an item, when the item goes on after it.
          else if (lines[i].trim() === "" && lines[i + 1]?.startsWith("  ")) itemLines.push(lines[i++]);
          else break;
        }
        items.push(parseBlocks(itemLines));
      }
      blocks.push({ kind: "list", items });
    } else {
      const text: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("- ") && !lines[i].startsWith("|")) {
        text.push(lines[i++].trim());
      }
      blocks.push({ kind: "paragraph", content: parseInline(text.join(" ")) });
    }
  }
  return blocks;
}

export function parseLegalText(source: string): LegalText {
  const lines = source.split("\n");
  const titleLine = lines.findIndex((line) => line.startsWith("# "));
  if (titleLine < 0) throw new Error("parseLegalText: no '# ' title");
  const starts = lines.flatMap((line, index) => (line.startsWith("## ") ? [index] : []));
  const preambleEnd = starts[0] ?? lines.length;
  return {
    title: lines[titleLine].slice(2).trim(),
    preamble: parseBlocks(lines.slice(titleLine + 1, preambleEnd)),
    sections: starts.map((start, n) => ({
      title: lines[start].slice(3).trim(),
      blocks: parseBlocks(lines.slice(start + 1, starts[n + 1] ?? lines.length)),
    })),
  };
}
