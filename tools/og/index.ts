// Bakes the social cards into the client build, one PNG per page per language,
// at /og/<card>-<language>.png. Nothing about a card depends on the request, so
// there is no reason to rasterise them in the worker: the pages link to them by
// name through src/lib/og.ts, and the CDN serves them like any other asset.

import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { runnerImport } from "vite";
import solid from "vite-plugin-solid";
import { type Language, parseLanguage } from "../../src/lib/language.ts";
import { type OgCardKey, ogCardPath } from "../../src/lib/og.ts";
import { projectContent } from "../projects/index.ts";

type CardModule = typeof import("./Card.tsx");

const CARD_MODULE = fileURLToPath(new URL("./Card.tsx", import.meta.url));

async function renderFromModule(
  module: Record<string, unknown>,
  key: OgCardKey,
  language: Language,
): Promise<Uint8Array> {
  const candidate = module.renderCard;
  if (typeof candidate !== "function") throw new Error("OG card module has no renderCard export");

  const value: unknown = await candidate(key, language);
  if (!(value instanceof Uint8Array)) throw new Error("OG card renderer did not return PNG bytes");
  return value;
}

const LANGUAGES: Language[] = ["en", "fr"];

function assetName(key: OgCardKey, language: Language): string {
  return ogCardPath(key, language).slice(1);
}

/** The card and language a request path names, if it names one. */
function parseCardPath(pathname: string): [string, Language] | undefined {
  const match = /^\/og\/(.+)-([a-z]{2})\.png$/.exec(pathname);
  const language = parseLanguage(match?.[2]);
  return match?.[1] && language ? [match[1], language] : undefined;
}

export function ogCards(): Plugin {
  let buildModule: Promise<CardModule> | undefined;

  const loadBuildModule = () => {
    buildModule ??= runnerImport<CardModule>(CARD_MODULE, {
      configFile: false,
      plugins: [solid({ ssr: true }), projectContent()],
    }).then(({ module }) => module);
    return buildModule;
  };

  return {
    name: "phinner.dev:og-cards",

    // Rendered on demand in development so the cards can be opened and iterated
    // on without a build; the build is where they are actually produced.
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const target = parseCardPath(new URL(request.url ?? "/", "http://localhost").pathname);
        if (!target) return next();

        server
          .ssrLoadModule(CARD_MODULE)
          .then((module) => {
            const [key, language] = target;
            const keys: unknown = module.cardKeys?.();
            if (!Array.isArray(keys) || !keys.includes(key)) return undefined;
            return renderFromModule(module, key, language);
          })
          .then((png) => {
            if (!png) return next();
            response.setHeader("content-type", "image/png");
            response.end(png);
          }, next);
      });
    },

    async generateBundle() {
      if (this.environment.name !== "client") return;

      const { cardKeys, renderCard } = await loadBuildModule();

      for (const key of cardKeys()) {
        for (const language of LANGUAGES) {
          this.emitFile({
            type: "asset",
            fileName: assetName(key, language),
            source: await renderCard(key, language),
          });
        }
      }
    },
  };
}
