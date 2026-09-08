import type { Component } from "solid-js";
import type { ImageSource } from "../components/Image";
import type { Content } from "../components/LanguageProvider";
import type { DateRange } from "../lib/dates";

export const PROJECT_NAMES = ["nohorny", "imperium", "rteam"] as const;

export type ProjectName = (typeof PROJECT_NAMES)[number];

export type ProjectSummary = {
  name: ProjectName;
  title: string;
  image: ImageSource & { kind: "logo" | "screenshot" };
  tags: string[];
  period?: DateRange;
  content: Content<{ description: string; role?: string }>;
  link: { href: string; label: Content<string>; icon?: Component };
};
