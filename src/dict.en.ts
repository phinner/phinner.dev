import { template } from "@solid-primitives/i18n";
import type { JSX } from "solid-js";

export const dict = {
  hero: {
    role: "Software developer",
    introduction: "I'm a CS student living in Belgium",
    specialty:
      "I primarily build and run backend systems in Java and Kotlin, specializing in moderation and developer tooling for game servers.",
    copyEmail: "Copy email address",
    emailCopied: "Email copied",
  },
  sections: {
    experience: "My experience",
    projects: "Featured projects",
  },
  language: {
    switchToEnglish: "Switch to English",
    switchToFrench: "Switch to French",
  },
  experience: {
    rteam: {
      title: "Full-stack developer @ RTeam",
      period: "June 2026 - now",
      description: "RTeam is a small repair business in Namur, BE.",
      website: (website: JSX.Element): JSX.Element => [
        "I built their website (",
        website,
        ") and admin dashboard, covering repair tracking, sales, and training for new technicians.",
      ],
      operations: (facebook: JSX.Element, google: JSX.Element): JSX.Element => [
        "And manage their domains, email, and online presence (",
        facebook,
        " and ",
        google,
        ").",
      ],
    },
    openSource: {
      title: "Open-source work",
      period: "2019 - now",
      introduction: (mindustry: JSX.Element): JSX.Element => [
        "Most of my open-source work revolves around ",
        mindustry,
        ", an open-source factory-building game. My notable contributions were the following:",
      ],
      dependencyResolution: (first: JSX.Element, second: JSX.Element): JSX.Element => [
        "Brought major improvements to dependency resolution for mods and plugins (",
        first,
        ", ",
        second,
        ").",
      ],
      srvRecords: (mindustry: JSX.Element, arc: JSX.Element): JSX.Element => [
        "Added SRV record support, so server owners can share a readable address instead of an IP and port (",
        mindustry,
        ", ",
        arc,
        ").",
      ],
      xpdustry: (xpdustry: JSX.Element): JSX.Element => [
        "Since 2019, I have also run ",
        xpdustry,
        ", my own Mindustry server network. I build tooling for it and other server networks.",
      ],
    },
  },
  projects: {
    source: "source",
    nohorny: {
      displayBlocks:
        "Mindustry lets players build display blocks that render arbitrary images. As you can imagine, some people use them to post NSFW content.",
      classification:
        "Nohorny finds those displays, renders them, and runs each image through a local classification model. Hits are automatically banned or reported to Discord for a moderator to confirm.",
      usage: "It has run on my servers since 2022 and is used by other networks.",
    },
    imperium: {
      description: "The plugin that runs my server network.",
      moderation: "Advanced moderation tools.",
      communication:
        "Inter-server communication for the remote moderation tools, Discord chat bridge, etc.",
      operations: "Crash detection, error reporting, and metrics.",
    },
    toxopid: {
      description:
        "A Gradle plugin that launches a Mindustry test client or server straight from your project directory instead of copying JARs by hand every time.",
      usage: "Available on the Gradle Plugin Portal and used by other mod and plugin developers.",
    },
    moreOnGitHub: "See more projects on GitHub",
  },
  footer: {
    copyright: template<{ year: number; name: string }>(
      "© {{ year }} {{ name }}. All rights reserved.",
    ),
    backToTop: "Back to top",
  },
};

export type Dictionary = typeof dict;
