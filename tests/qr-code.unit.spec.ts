import { expect, test } from "@playwright/test";
import { storeLinks } from "../src/content/site";
import { qrCode, qrPath } from "../src/lib/qr-code";

// The decode itself is checked in a browser (tests/site.spec.ts): these hold the structure a scanner looks for.

test("the listing fits in version 5 (37 modules)", () => {
  expect(qrCode(storeLinks.garageToAgiGooglePlay)).toHaveLength(37);
  expect(qrCode("HELLO")).toHaveLength(21);
});

test("finder patterns sit in three corners and the timing patterns alternate", () => {
  const modules = qrCode(storeLinks.garageToAgiGooglePlay);
  const size = modules.length;
  const finder = (left: number, top: number) =>
    Array.from({ length: 7 }, (_, y) =>
      Array.from({ length: 7 }, (_, x) => {
        const ring = Math.max(Math.abs(x - 3), Math.abs(y - 3));
        return modules[top + y][left + x] === (ring !== 2);
      }).every(Boolean),
    ).every(Boolean);
  expect(finder(0, 0)).toBe(true);
  expect(finder(size - 7, 0)).toBe(true);
  expect(finder(0, size - 7)).toBe(true);
  for (let i = 8; i < size - 8; i++) {
    expect(modules[6][i]).toBe(i % 2 === 0);
    expect(modules[i][6]).toBe(i % 2 === 0);
  }
  expect(modules[size - 8][8]).toBe(true); // the dark module
});

test("both copies of the format information say level M and agree", () => {
  const modules = qrCode(storeLinks.garageToAgiGooglePlay);
  const size = modules.length;
  const bit = (x: number, y: number): number => (modules[y][x] ? 1 : 0);
  const first = [0, 1, 2, 3, 4, 5, 7, 8].map((y) => bit(8, y)).concat([7, 5, 4, 3, 2, 1, 0].map((x) => bit(x, 8)));
  const second = Array.from({ length: 8 }, (_, i) => bit(size - 1 - i, 8)).concat(Array.from({ length: 7 }, (_, i) => bit(8, size - 7 + i)));
  expect(first).toEqual(second);
  const value = first.reduce((bits, b, i) => bits | (b << i), 0) ^ 0x5412;
  expect(value >> 13).toBe(0); // level M is 00
});

test("the path draws exactly the dark modules", () => {
  const modules = qrCode("HELLO");
  const dark = modules.flat().filter(Boolean).length;
  const runs = [...qrPath(modules, 4).matchAll(/h(\d+)/g)].reduce((sum, match) => sum + Number(match[1]), 0);
  expect(runs).toBe(dark);
});

test("text too long for version 6 is refused", () => {
  expect(() => qrCode("x".repeat(200))).toThrow(/version 6/);
});
