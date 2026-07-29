import { template } from "@solid-primitives/i18n";
import type { JSX } from "solid-js";
import type { Dictionary } from "./dict.en";

export const dict: Dictionary = {
  hero: {
    role: "Développeur",
    introduction: "Salutations, Je suis un étudiant en informatique vivant en Belgique",
    specialty:
      "Je conçois principalement des systèmes backend en Java et Kotlin, avec une spécialisation dans les outils de modération et de développement pour serveurs de jeu.",
    copyEmail: "Copier l’adresse e-mail",
    emailCopied: "Adresse e-mail copiée",
  },
  sections: {
    experience: "Mon expérience",
    projects: "Mes projets",
  },
  language: {
    switchToEnglish: "Passer en anglais",
    switchToFrench: "Passer en français",
  },
  experience: {
    rteam: {
      title: "Développeur full-stack @ RTeam",
      period: "Juin 2026 - aujourd’hui",
      description: "RTeam est une petite entreprise de réparation à Namur, en Belgique.",
      website: (website: JSX.Element): JSX.Element => [
        "J’ai conçu leur site web (",
        website,
        ") ainsi que leur panneau administrateur, qui couvre le suivi des réparations, les ventes et la formation des nouveaux techniciens.",
      ],
      operations: (facebook: JSX.Element, google: JSX.Element): JSX.Element => [
        "Je gère aussi leurs domaines, leurs e-mails et leur présence en ligne (",
        facebook,
        " et ",
        google,
        ").",
      ],
    },
    openSource: {
      title: "Travail open source",
      period: "2019 - aujourd’hui",
      introduction: (mindustry: JSX.Element): JSX.Element => [
        "La plupart de mon travail open source porte sur ",
        mindustry,
        ", un jeu de construction d’usines open source. Voici mes contributions les plus notables :",
      ],
      dependencyResolution: (first: JSX.Element, second: JSX.Element): JSX.Element => [
        "J’ai apporté des améliorations majeures à la résolution des dépendances des mods et plugins (",
        first,
        ", ",
        second,
        ").",
      ],
      srvRecords: (mindustry: JSX.Element, arc: JSX.Element): JSX.Element => [
        "J’ai ajouté la prise en charge des enregistrements SRV, afin que les propriétaires de serveurs puissent partager une adresse lisible plutôt qu’une adresse IP et un port (",
        mindustry,
        ", ",
        arc,
        ").",
      ],
      xpdustry: (xpdustry: JSX.Element): JSX.Element => [
        "Depuis 2019, je gère également ",
        xpdustry,
        ", mon propre réseau de serveurs Mindustry. Je développe des outils pour celui-ci et d’autres réseaux.",
      ],
    },
  },
  projects: {
    source: "code source",
    nohorny: {
      displayBlocks:
        "Mindustry permet aux joueurs de construire des blocs d’affichage capables d'afficher des images arbitraires. Comme vous pouvez l’imaginer, certains s’en servent pour publier du contenu NSFW.",
      classification:
        "Nohorny repère ces blocs, extrait les images, puis passe chaque image dans un modèle de classification local. Les détections entraînent un bannissement automatique ou sont signalées sur Discord afin qu’un modérateur les confirme.",
      usage:
        "Il fonctionne sur mes serveurs depuis 2022 et est aussi utilisé par d’autres réseaux.",
    },
    imperium: {
      description: "Le plugin qui fait tourner mon réseau de serveurs.",
      moderation: "Des outils de modération avancés.",
      communication:
        "Communication inter-serveurs pour les outils de modération à distance, tchat partagé avec Discord, etc.",
      operations: "Détection des crashs, signalement des erreurs et collection des métriques.",
    },
    toxopid: {
      description:
        "Un plugin Gradle qui lance un client ou serveur de test Mindustry directement depuis votre projet, sans devoir copier les JARs à la main à chaque fois.",
      usage:
        "Disponible sur le portail des plugins Gradle et utilisé par d’autres développeurs de mods et de plugins.",
    },
    moreOnGitHub: "Voir plus de projets sur GitHub",
  },
  footer: {
    copyright: template<{ year: number; name: string }>(
      "© {{ year }} {{ name }}. Tous droits réservés.",
    ),
    backToTop: "Retour en haut",
  },
};
