import { PROJECT_NAMES } from "../projects/types.ts";
import type { Language } from "./language.ts";

// The social cards are PNGs baked into the client build by tools/og. This
// module is the contract between the two sides: the plugin renders one card per
// key and language, the pages link to them by the same name.

export const OG_CARD_KEYS = ["home", "projects", "not-found", ...PROJECT_NAMES] as const;

export type OgCardKey = (typeof OG_CARD_KEYS)[number];

export const OG_CARD_WIDTH = 1200;
export const OG_CARD_HEIGHT = 630;

export function ogCardKey(pathname: string): OgCardKey {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (path === "/") return "home";
  if (path === "/projects") return "projects";

  const name = /^\/projects\/([^/]+)$/.exec(path)?.[1];
  return PROJECT_NAMES.find((candidate) => candidate === name) ?? "not-found";
}

export function ogCardPath(key: OgCardKey, language: Language): string {
  return `/og/${key}-${language}.png`;
}
