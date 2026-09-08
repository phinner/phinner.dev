import { rteamImage } from "../assets/images";
import { Month } from "../lib/dates";
import type { ProjectSummary } from "./types";

export const summary = {
  name: "rteam",
  title: "RTeam",
  image: {
    ...rteamImage,
    kind: "screenshot",
  },
  period: { start: { month: Month.June, year: 2026 }, end: "now" },
  tags: ["React Router", "TypeScript", "SQL"],
  content: {
    en: {
      description:
        "Web app for a repair business, with a public website and a platform for managing repairs.",
      role: "Full-stack developer",
    },
    fr: {
      description:
        "Une application web pour une entreprise de réparation, avec un site public et un outil de suivi des réparations.",
      role: "Développeur full-stack",
    },
  },
  link: {
    href: "https://rteam.be",
    label: {
      en: "rteam.be",
      fr: "rteam.be",
    },
  },
} satisfies ProjectSummary;
