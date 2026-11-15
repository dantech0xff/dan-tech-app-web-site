import { expect, test } from "@playwright/test";
import { parseRange, withByteRange } from "../worker/byte-range";

// The Worker's answer to video range requests, which Safari needs before it plays a video.

const FILE = new Uint8Array(Array.from({ length: 100 }, (_, i) => i));
const full = () =>
  new Response(FILE.slice(), { status: 200, headers: { "Content-Type": "video/mp4", "Content-Length": "100", ETag: '"v1"' } });
const get = (headers: Record<string, string> = {}, method = "GET") => new Request("https://dantech.app/a.mp4", { method, headers });

test("parses the single ranges media players send", () => {
  expect(parseRange("bytes=0-1", 100)).toEqual({ start: 0, end: 1 });
  expect(parseRange("bytes=10-", 100)).toEqual({ start: 10, end: 99 });
  expect(parseRange("bytes=-5", 100)).toEqual({ start: 95, end: 99 });
  expect(parseRange("bytes=90-500", 100)).toEqual({ start: 90, end: 99 });
  expect(parseRange("bytes=-500", 100)).toEqual({ start: 0, end: 99 });
  expect(parseRange("bytes=100-", 100)).toBe("unsatisfiable");
  expect(parseRange("bytes=5-2", 100)).toBe("unsatisfiable");
  expect(parseRange("bytes=-0", 100)).toBe("unsatisfiable");
  // Not one plain byte range: the whole file.
  expect(parseRange("bytes=0-1,5-6", 100)).toBeNull();
  expect(parseRange("items=0-1", 100)).toBeNull();
  expect(parseRange("bytes=-", 100)).toBeNull();
});

test("Safari's first probe gets two bytes and the file size", async () => {
  const response = await withByteRange(get({ Range: "bytes=0-1" }), full());
  expect(response.status).toBe(206);
  expect(response.headers.get("Content-Range")).toBe("bytes 0-1/100");
  expect(response.headers.get("Content-Length")).toBe("2");
  expect(response.headers.get("Accept-Ranges")).toBe("bytes");
  expect(response.headers.get("Content-Type")).toBe("video/mp4");
  expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([0, 1]);
});

test("a request without Range gets the whole file and learns ranges work", async () => {
  const response = await withByteRange(get(), full());
  expect(response.status).toBe(200);
  expect(response.headers.get("Accept-Ranges")).toBe("bytes");
  expect((await response.arrayBuffer()).byteLength).toBe(100);
});

test("a range past the end is refused with the file size", async () => {
  const response = await withByteRange(get({ Range: "bytes=200-" }), full());
  expect(response.status).toBe(416);
  expect(response.headers.get("Content-Range")).toBe("bytes */100");
});

test("a stale If-Range gets the whole file", async () => {
  const fresh = await withByteRange(get({ Range: "bytes=0-1", "If-Range": '"v1"' }), full());
  expect(fresh.status).toBe(206);
  const stale = await withByteRange(get({ Range: "bytes=0-1", "If-Range": '"v0"' }), full());
  expect(stale.status).toBe(200);
});

test("misses and compressed bodies pass through untouched", async () => {
  const missing = new Response("not found", { status: 404 });
  expect(await withByteRange(get({ Range: "bytes=0-1" }), missing)).toBe(missing);
  const compressed = new Response("x", { status: 200, headers: { "Content-Encoding": "br" } });
  expect(await withByteRange(get({ Range: "bytes=0-1" }), compressed)).toBe(compressed);
});
