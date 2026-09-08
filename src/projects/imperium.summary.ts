import { xpdustryImage } from "../assets/images";
import { GitHubIcon } from "../components/Icon";
import type { ProjectSummary } from "./types";

export const summary = {
  name: "imperium",
  title: "Imperium",
  image: {
    ...xpdustryImage,
    kind: "logo",
  },
  tags: ["Kotlin", "SQL"],
  content: {
    en: {
      description: "The plugin that runs and moderates my Mindustry server network.",
    },
    fr: {
      description: "Le plugin qui fait tourner et modère mon réseau de serveurs Mindustry.",
    },
  },
  link: {
    icon: GitHubIcon,
    href: "https://github.com/xpdustry/imperium",
    label: {
      en: "Source code",
      fr: "Code source",
    },
  },
} satisfies ProjectSummary;
