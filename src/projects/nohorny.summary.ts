import { nohornyImage } from "../assets/images";
import { GitHubIcon } from "../components/Icon";
import type { ProjectSummary } from "./types";

export const summary = {
  name: "nohorny",
  title: "NoHorny",
  image: {
    ...nohornyImage,
    kind: "logo",
  },
  tags: ["Java", "Spring Boot", "Machine learning"],
  content: {
    en: {
      description: "Automated image moderation for Mindustry game servers.",
    },
    fr: {
      description: "Modération automatique d'images pour les serveurs de jeu Mindustry.",
    },
  },
  link: {
    icon: GitHubIcon,
    href: "https://github.com/xpdustry/nohorny",
    label: {
      en: "Source code",
      fr: "Code source",
    },
  },
} satisfies ProjectSummary;
