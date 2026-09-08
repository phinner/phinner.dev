import { getRequestEvent, isServer, parseCookieHeader } from "@solidjs/web";

export type Language = "en" | "fr";

export function parseLanguage(value: unknown): Language | undefined {
  return value === "en" || value === "fr" ? value : undefined;
}

function isLanguageRange(tag: string): boolean {
  if (tag === "*") return true;

  const subtags = tag.split("-");
  for (const [index, subtag] of subtags.entries()) {
    if (subtag.length === 0 || subtag.length > 8) return false;

    for (const character of subtag) {
      const letter = character >= "a" && character <= "z";
      const digit = character >= "0" && character <= "9";
      if (!(letter || (index > 0 && digit))) return false;
    }
  }

  return true;
}

function parseQuality(parameter: string): number | undefined {
  if (!parameter.startsWith("q=")) return undefined;

  const value = parameter.slice(2).trim();
  if (value === "") return undefined;

  const quality = Number(value);
  return Number.isFinite(quality) && quality >= 0 && quality <= 1 ? quality : undefined;
}

export function resolveLanguage(cookie: string | undefined, header: string | null): Language {
  const saved = parseLanguage(cookie);
  if (saved) return saved;

  let language: Language = "en";
  let highestQuality = 0;

  for (const entry of (header ?? "").split(",")) {
    const [range = "", parameter, extra] = entry.trim().toLowerCase().split(";");
    const tag = range.trimEnd();
    if (!isLanguageRange(tag) || extra !== undefined) continue;

    const quality = parameter === undefined ? 1 : parseQuality(parameter.trimStart());
    if (quality === undefined || quality <= highestQuality) continue;

    // Keep the first preference on ties; unsupported preferences fall back to English.
    highestQuality = quality;
    language = parseLanguage(tag.split("-")[0]) ?? "en";
  }

  return language;
}

export function initialLanguage() {
  if (!isServer) return parseLanguage(document.documentElement.lang) ?? "en";
  const headers = getRequestEvent()?.request.headers;

  return resolveLanguage(
    parseCookieHeader(headers?.get("cookie")).lang,
    headers?.get("accept-language") ?? null,
  );
}
