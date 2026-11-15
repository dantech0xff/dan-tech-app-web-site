/*
 * The Worker script of dantech.app. It runs only for the paths `run_worker_first` names in wrangler.jsonc (videos);
 * everything else is answered from the static files in out/ without it. For a miss it can also run, and then it
 * returns the asset layer's own answer (the 404 page).
 */
import { withByteRange } from "./byte-range";

type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    // The asset layer ignores Range, so ask it for the whole file and cut the range here.
    const full = await env.ASSETS.fetch(new Request(request.url, { method: request.method, headers: withoutRange(request.headers) }));
    return withByteRange(request, full);
  },
};

export default worker;

function withoutRange(headers: Headers): Headers {
  const copy = new Headers(headers);
  copy.delete("Range");
  copy.delete("If-Range");
  return copy;
}
