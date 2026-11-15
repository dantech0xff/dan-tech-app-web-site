/*
 * Byte ranges for static files. Workers static assets answer a `Range` request with the whole file and status 200,
 * and Safari will not play a video from a server that does that. This turns the asset's full response into the
 * `206 Partial Content` (or `416`) the request asks for. One range per request, which is what media players send;
 * anything else gets the full file, as RFC 9110 allows.
 */

type Range = { start: number; end: number };

/** The one byte range of a `Range` header, clamped to the file; `null` to send the whole file, "unsatisfiable" for a 416. */
export function parseRange(header: string, size: number): Range | null | "unsatisfiable" {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, first, last] = match;
  if (first === "" && last === "") return null;
  if (first === "") {
    // A suffix: the last N bytes.
    const length = Number(last);
    if (length === 0 || size === 0) return "unsatisfiable";
    return { start: Math.max(0, size - length), end: size - 1 };
  }
  const start = Number(first);
  const end = last === "" ? size - 1 : Math.min(Number(last), size - 1);
  if (start >= size || end < start) return "unsatisfiable";
  return { start, end };
}

/** Answers `request`'s `Range` header from `full`, the asset's complete 200 response. */
export async function withByteRange(request: Request, full: Response): Promise<Response> {
  // Errors, redirects and compressed bodies (whose bytes are not the file's) go out as they came.
  if (full.status !== 200 || full.headers.has("Content-Encoding")) return full;
  const header = request.headers.get("Range");
  const headers = new Headers(full.headers);
  headers.set("Accept-Ranges", "bytes");

  // A stale If-Range validator means the client's partial copy is out of date: send it all.
  const ifRange = request.headers.get("If-Range");
  const etag = full.headers.get("ETag");
  const stale = ifRange !== null && ifRange !== etag && ifRange !== full.headers.get("Last-Modified");
  if (!header || stale || request.method !== "GET") {
    return new Response(full.body, { status: 200, headers });
  }

  const body = await full.arrayBuffer();
  const range = parseRange(header, body.byteLength);
  if (range === null) return new Response(body, { status: 200, headers });
  if (range === "unsatisfiable") {
    headers.delete("Content-Length");
    headers.set("Content-Range", `bytes */${body.byteLength}`);
    return new Response(null, { status: 416, headers });
  }
  const part = body.slice(range.start, range.end + 1);
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${body.byteLength}`);
  headers.set("Content-Length", String(part.byteLength));
  return new Response(part, { status: 206, headers });
}
