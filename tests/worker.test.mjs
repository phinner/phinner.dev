import assert from "node:assert/strict";
import { test } from "node:test";
import { unstable_dev } from "wrangler";

test("Cloudflare serves localized pages, assets, and API responses", {
  timeout: 30000,
}, async (t) => {
  const worker = await unstable_dev("dist/server/worker.js", {
    config: "wrangler.jsonc",
    local: true,
    ip: "127.0.0.1",
    port: 0,
    inspectorPort: 0,
    vars: { GITHUB_TOKEN: "" },
    experimental: { disableDevRegistry: true, watch: false, disableExperimentalWarning: true },
  });
  t.after(() => worker.stop());

  for (const path of [
    "/",
    "/projects",
    "/projects/nohorny",
    "/projects/imperium",
    "/projects/rteam",
  ]) {
    for (const language of ["en", "fr"]) {
      const response = await worker.fetch(path, {
        headers: { Cookie: `lang=${language}`, "Sec-Fetch-Mode": "navigate" },
      });
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("content-language"), language);
      assert.match(response.headers.get("cache-control"), /no-store/);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]*lang="${language}"`));
      const asset = html.match(/src="([^"]+\.js)"/)?.[1];
      assert.ok(asset);
      const javascript = await worker.fetch(asset);
      assert.equal(javascript.status, 200);
      assert.match(javascript.headers.get("content-type"), /javascript/);
      assert.equal(javascript.headers.get("cache-control"), "public, max-age=31536000, immutable");
    }
  }
  assert.equal((await worker.fetch("/projects/missing")).status, 404);
  const activity = await worker.fetch("/api/github");
  assert.equal(activity.status, 200);
  assert.equal(await activity.json(), null);
  assert.equal(activity.headers.get("cache-control"), "no-store");
  assert.equal((await worker.fetch("/api/github", { method: "POST" })).status, 405);
});
