import { expect, test } from "@playwright/test";
import { contactMailto, subscribeMailto } from "../src/lib/mailto";
import { subscribeToShipNotes } from "../src/lib/newsletter";

// Pure logic: no browser page needed.

test("contact mailto keeps the design's subject and signature format", () => {
  const url = new URL(contactMailto({ name: "An", email: "an@example.com", topic: "", message: "Hi\nthere" }));
  expect(url.protocol).toBe("mailto:");
  expect(url.searchParams.get("subject")).toBe("[dantech.app] Hello — An");
  // RFC 6068 line breaks.
  expect(url.searchParams.get("body")).toBe("Hi\r\nthere\r\n\r\n— An <an@example.com>");
});

test("subscribe mailto carries the address", () => {
  const url = new URL(subscribeMailto("reader@example.com"));
  expect(url.searchParams.get("subject")).toBe("[dantech.app] Ship notes — subscribe");
  expect(url.searchParams.get("body")).toContain("reader@example.com");
});

test.describe("subscribeToShipNotes with an endpoint", () => {
  const realFetch = globalThis.fetch;
  test.afterEach(() => {
    globalThis.fetch = realFetch;
  });

  test("posts the address as JSON", async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      return new Response("{}", { status: 200 });
    }) as typeof fetch;

    await expect(subscribeToShipNotes("reader@example.com", "https://example.com/subscribe")).resolves.toBe("subscribed");
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://example.com/subscribe");
    expect(calls[0].init?.method).toBe("POST");
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({ email: "reader@example.com" });
  });

  test("rejects when the endpoint fails", async () => {
    globalThis.fetch = (async () => new Response("nope", { status: 500 })) as typeof fetch;
    await expect(subscribeToShipNotes("reader@example.com", "https://example.com/subscribe")).rejects.toThrow("500");
  });
});
