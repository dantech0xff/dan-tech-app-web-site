#!/usr/bin/env node
// Serves the static export the way production hosts do: `/about` redirects to
// `/about/`, which serves `about/index.html`; misses get `404.html` with status 404.
// Usage: node scripts/serve-static.mjs [dir]   (PORT env, default 4311; localhost only)
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.env.PORT ?? 4311);
const host = "127.0.0.1";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** Maps a URL path into `root`; null when it would escape it. Throws on malformed escapes. */
function toFsPath(pathname) {
  const fsPath = resolve(root, `.${decodeURIComponent(pathname)}`);
  return fsPath === root || fsPath.startsWith(root + sep) ? fsPath : null;
}

function sendFile(response, status, file) {
  const stream = createReadStream(file);
  stream.on("open", () => {
    response.writeHead(status, { "Content-Type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream" });
    stream.pipe(response);
  });
  stream.on("error", () => {
    if (!response.headersSent) response.writeHead(500);
    response.end();
  });
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${host}`);
    const fsPath = toFsPath(url.pathname);
    if (fsPath && (await isFile(fsPath))) return sendFile(response, 200, fsPath);
    if (fsPath && (await isFile(join(fsPath, "index.html")))) {
      if (url.pathname.endsWith("/")) return sendFile(response, 200, join(fsPath, "index.html"));
      response.writeHead(308, { Location: `${url.pathname}/${url.search}` });
      return response.end();
    }
    sendFile(response, 404, join(root, "404.html"));
  } catch {
    response.writeHead(400);
    response.end();
  }
}).listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});
