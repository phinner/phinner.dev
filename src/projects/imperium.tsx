import { WhatIsMindustry } from "../components/Callout";
import { type Content, useLanguage } from "../components/LanguageProvider";

export function DeepDive() {
  const { language } = useLanguage();
  const content = {
    get en() {
      return (
        <>
          <WhatIsMindustry />
          <h2>The project</h2>
          <p>Imperium is a set of tools to manage and run my Mindustry game servers.</p>
          <p>Most of its features cover these needs:</p>
          <ul>
            <li>
              Moderation. Servers share bans and other sanctions so a punished player can't just
              switch to another server.
            </li>
            <li>Monitoring. Detecting crashes, reporting errors and collecting metrics.</li>
            <li>
              Utilities. A chat bridge between Discord and Mindustry lets me talk with players
              without starting the game.
            </li>
            <li>
              Translation. Community members help me on Weblate to make the servers accessible to as
              many people as possible.
            </li>
          </ul>
          <p>
            This is also the project where I test utilities that are later implemented in my{" "}
            <a
              href="https://github.com/xpdustry/distributor"
              target="_blank"
              rel="noopener noreferrer"
            >
              shared framework
            </a>{" "}
            used by other tools or{" "}
            <a href="https://github.com/anuken/mindustry" target="_blank" rel="noopener noreferrer">
              Mindustry
            </a>{" "}
            directly.
          </p>
        </>
      );
    },
    get fr() {
      return (
        <>
          <WhatIsMindustry />
          <h2>Le projet</h2>
          <p>Imperium rassemble les outils qui font tourner mes serveurs de jeu Mindustry.</p>
          <p>Ses fonctionnalités tournent surtout autour de ces besoins :</p>
          <ul>
            <li>
              La modération. Les serveurs partagent les bannissements et les autres sanctions pour
              éviter qu'un joueur sanctionné sur un serveur passe simplement sur un autre.
            </li>
            <li>
              La supervision. Détecter les crashs, signaler les erreurs et collecter des métriques.
            </li>
            <li>
              Les outils pratiques. Un relais du tchat entre Discord et Mindustry permet de discuter
              avec les joueurs sans lancer le jeu.
            </li>
            <li>
              La traduction. Des membres de la communauté m'aident sur Weblate pour rendre les
              serveurs accessibles au plus grand nombre.
            </li>
          </ul>
          <p>
            C'est aussi là que je teste des outils avant de les intégrer à mon{" "}
            <a
              href="https://github.com/xpdustry/distributor"
              target="_blank"
              rel="noopener noreferrer"
            >
              framework commun
            </a>
            , utilisé par d'autres projets, ou directement à{" "}
            <a href="https://github.com/anuken/mindustry" target="_blank" rel="noopener noreferrer">
              Mindustry
            </a>
            .
          </p>
        </>
      );
    },
  } satisfies Content;

  return <>{content[language()]}</>;
}
