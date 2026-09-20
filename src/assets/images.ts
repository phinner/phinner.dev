import type { ImageSource } from "../components/Image";
import nohornyPreview from "./previews/nohorny.webp?inline";
import rteamEnglishPreview from "./previews/rteam-en.webp?inline";
import rteamFrenchPreview from "./previews/rteam-fr.webp?inline";
import xpdustryPreview from "./previews/xpdustry.webp?inline";

export const nohornyImage = {
  src: "/img/nohorny.svg",
  preview: nohornyPreview,
  width: 194,
  height: 118,
} satisfies ImageSource;

export const rteamImages = {
  en: {
    src: "/img/rteam-site-en.webp",
    preview: rteamEnglishPreview,
    width: 1280,
    height: 720,
  },
  fr: {
    src: "/img/rteam-site-fr.webp",
    preview: rteamFrenchPreview,
    width: 1280,
    height: 720,
  },
} satisfies Record<"en" | "fr", ImageSource>;

export const xpdustryImage = {
  src: "/img/xpdustry.svg",
  preview: xpdustryPreview,
  width: 2048,
  height: 2048,
} satisfies ImageSource;
