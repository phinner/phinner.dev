import type { ImageSource } from "../components/Image";
import nohornyPreview from "./previews/nohorny.webp?inline";
import rteamPreview from "./previews/rteam.webp?inline";
import xpdustryPreview from "./previews/xpdustry.webp?inline";

export const nohornyImage = {
  src: "/img/nohorny.svg",
  preview: nohornyPreview,
  width: 194,
  height: 118,
} satisfies ImageSource;

export const rteamImage = {
  src: "/img/rteam-site.jpg",
  preview: rteamPreview,
  width: 1280,
  height: 720,
} satisfies ImageSource;

export const xpdustryImage = {
  src: "/img/xpdustry.svg",
  preview: xpdustryPreview,
  width: 2048,
  height: 2048,
} satisfies ImageSource;
