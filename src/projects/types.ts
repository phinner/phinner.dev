import type { Component } from "solid-js";
import type { ImageSource } from "../components/Image.tsx";
import type { Content } from "../components/LanguageProvider.tsx";
import type { DateRange } from "../lib/dates.ts";
import type { Language } from "../lib/language.ts";

export const PROJECT_NAMES = ["nohorny", "imperium", "rteam"] as const;

export type ProjectName = (typeof PROJECT_NAMES)[number];

export type ProjectImage =
  | (ImageSource & { kind: "logo" | "screenshot" })
  | { kind: "localized-screenshot"; sources: Content<ImageSource> };

export function resolveProjectImage(image: ProjectImage, language: Language): ImageSource {
  return image.kind === "localized-screenshot" ? image.sources[language] : image;
}

export function isProjectScreenshot(image: ProjectImage): boolean {
  return image.kind !== "logo";
}

export type ProjectSummary = {
  name: ProjectName;
  title: string;
  image: ProjectImage;
  tags: string[];
  period?: DateRange;
  content: Content<{ description: string; role?: string }>;
  link: { href: string; label: Content<string>; icon?: Component };
};
