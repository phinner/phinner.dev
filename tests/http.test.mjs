import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";

test("production pages, 404s, and JavaScript assets work", { timeout: 20000 }, async (t) => {
  const server = spawn(process.execPath, ["dist/server/node.js"], {
    env: { ...process.env, PORT: "0", GITHUB_TOKEN: "" },
    stdio: ["ignore", "pipe", "inherit"],
  });
  t.after(async () => {
    if (!server.pid || server.exitCode !== null || server.signalCode !== null) return;
    const closed = once(server, "close");
    server.kill("SIGTERM");
    const timeout = setTimeout(() => server.kill("SIGKILL"), 6000);
    await closed;
    clearTimeout(timeout);
  });
  const origin = await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Server startup timed out")), 10000);
    const fail = (error) => {
      clearTimeout(timeout);
      reject(error);
    };
    server.once("error", fail);
    server.once("exit", (code) => fail(new Error(`Server exited with code ${code}`)));
    server.stdout.on("data", (chunk) => {
      output += chunk;
      const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (address) {
        clearTimeout(timeout);
        resolve(address);
      }
    });
  });
  const get = (path, options) => fetch(`${origin}${path}`, { signal: t.signal, ...options });

  for (const path of [
    "/",
    "/projects",
    "/projects/nohorny",
    "/projects/imperium",
    "/projects/rteam",
  ]) {
    for (const language of ["en", "fr"]) {
      const response = await get(path, {
        headers: { Cookie: `lang=${language}`, "Accept-Language": language === "en" ? "fr" : "en" },
      });
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("content-language"), language);
      assert.match(response.headers.get("cache-control"), /no-store/);
      const page = await response.text();
      assert.match(page, new RegExp(`<html[^>]*lang="${language}"`));
      assert.match(page, /github\.com\/phinner\/phinner\.dev\/commit\/[a-f\d]{40}/i);
      for (const [anchor] of page.matchAll(/<a\b[^>]*>/g)) {
        if (!/href="(?:https?:\/\/|mailto:)/.test(anchor)) continue;
        assert.match(anchor, /target="_blank"/, `${path}: ${anchor}`);
        assert.match(anchor, /rel="[^"]*noopener/, `${path}: ${anchor}`);
      }
      for (const [image] of page.matchAll(/<img\b[^>]*>/g)) {
        if (/src="data:/.test(image)) continue;
        assert.match(image, /background-image:url\(&quot;data:image\/webp;base64,/);
        assert.match(image, /width="\d+"/);
        assert.match(image, /height="\d+"/);
      }
    }
  }
  for (const path of ["/missing", "/projects/missing", "/projects/constructor"]) {
    assert.equal((await get(path)).status, 404, path);
  }
  const html = await (await get("/")).text();
  const asset = html.match(/src="([^"]+\.js)"/)?.[1];
  assert.ok(asset, "The page must include a JavaScript entry");
  const javascript = await get(asset, { headers: { "Accept-Encoding": "br, gzip" } });
  assert.equal(javascript.status, 200);
  assert.match(javascript.headers.get("content-type"), /javascript/);
  assert.ok((await javascript.text()).length > 0);
  assert.equal((await get(asset, { method: "HEAD" })).status, 200);
});
