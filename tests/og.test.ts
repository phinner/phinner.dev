import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runnerImport } from "vite";
import solid from "vite-plugin-solid";
import { ogCardKey } from "../src/lib/og.ts";

type CardModule = typeof import("../tools/og/Card.tsx");

const cardModule = runnerImport<CardModule>(
  fileURLToPath(new URL("../tools/og/Card.tsx", import.meta.url)),
  { configFile: false, plugins: [solid({ ssr: true })] },
).then(({ module }) => module);

test("every page maps to a card, unknown paths to the 404 one", () => {
  assert.equal(ogCardKey("/"), "home");
  assert.equal(ogCardKey("/projects"), "projects");
  assert.equal(ogCardKey("/projects/"), "projects");
  assert.equal(ogCardKey("/projects/nohorny"), "nohorny");
  assert.equal(ogCardKey("/projects/rteam/"), "rteam");
  assert.equal(ogCardKey("/projects/nope"), "not-found");
  assert.equal(ogCardKey("/projects/nohorny/extra"), "not-found");
  assert.equal(ogCardKey("/whatever"), "not-found");
});

test("cards render shared project copy through Solid JSX", async () => {
  const { cardHtml } = await cardModule;
  const html = cardHtml("nohorny", "fr");

  assert.match(html, /NoHorny/);
  assert.match(html, /JAVA · SPRING BOOT · MACHINE LEARNING/);
  assert.match(html, /Modération automatique d'images/);
  assert.doesNotMatch(html, /<!--[\s\S]*?-->/);
});

test("Takumi renders a card at the advertised dimensions", async () => {
  const { renderCard } = await cardModule;
  const png = Buffer.from(await renderCard("home", "en"));

  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
