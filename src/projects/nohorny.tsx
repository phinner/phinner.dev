import { WhatIsMindustry } from "../components/Callout";
import { Image } from "../components/Image";
import { type Content, useLanguage } from "../components/LanguageProvider";
import { canvasImage, logicDisplayImage } from "./nohorny.images";
import styles from "./nohorny.module.css";

export function DeepDive() {
  const { language } = useLanguage();
  const content = {
    get en() {
      return (
        <>
          <WhatIsMindustry />
          <h2>The project</h2>
          <p>
            Mindustry has blocks that allow players to draw images. You can create pretty cool
            visuals with them.
          </p>
          <div class={styles.media}>
            <Image
              image={logicDisplayImage}
              loading="lazy"
              alt="A Mindustry logic display rendering a rotating cube"
            />
            <Image
              image={canvasImage}
              loading="lazy"
              alt="A smiley drawn in a Mindustry canvas block"
            />
          </div>
          <p>
            Some players use these blocks to display pornographic images on public servers. Other
            players, including children, can see them before a moderator responds.
          </p>
          <p>
            NoHorny scans these blocks, renders their images and sends them to a classification
            server. If an image is marked as unsafe, it deletes the blocks and bans the offending
            player.
          </p>
          <h2>The challenge</h2>
          <p>
            NoHorny must process blocks with as little impact on the game's main loop as possible.
          </p>
          <p>
            To do so, I group nearby blocks over several game ticks, then render the combined image
            and send it for classification on background threads.
          </p>
          <p>
            On the classification server, I had to find a way to keep costs down. So I primarily use
            a{" "}
            <a
              href="https://huggingface.co/Falconsai/nsfw_image_detection_26?not-for-all-audiences=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              local classification model
            </a>
            . It's fairly accurate and inference takes about 150 ms. But if it's given a very large
            or unusual image, it can mistakenly mark it as unsafe.
          </p>
          <p>
            To solve this, I pair it with{" "}
            <a href="https://sightengine.com/" target="_blank" rel="noopener noreferrer">
              Sightengine
            </a>
            , a dedicated content moderation service. The local model filters out obviously safe
            images, and Sightengine checks the rest.
          </p>
          <p>This lets me offer a free public classification service for other server owners.</p>
          <h2>In practice</h2>
          <p>
            Now, NoHorny is used by several Mindustry server networks to protect their servers. I
            keep working with them to make NoHorny easier to deploy and accommodate their needs.
          </p>
          <p>
            For example, NoHorny can send alerts via Discord webhooks, but some servers are hosted
            in countries where Discord is banned. To solve this, I implemented a utility to scrape
            free proxies and route the webhook requests through them.
          </p>
        </>
      );
    },
    get fr() {
      return (
        <>
          <WhatIsMindustry />
          <h2>Le projet</h2>
          <p>
            Mindustry propose des blocs qui permettent aux joueurs de dessiner des images. On peut
            faire des choses assez sympa avec.
          </p>
          <div class={styles.media}>
            <Image
              image={logicDisplayImage}
              loading="lazy"
              alt="Un écran logique de Mindustry affichant un cube en rotation"
            />
            <Image
              image={canvasImage}
              loading="lazy"
              alt="Un smiley dessiné sur un bloc de toile dans Mindustry"
            />
          </div>
          <p>
            Certains joueurs s'en servent pour afficher des images pornographiques sur les serveurs
            publics. Les autres joueurs, y compris les enfants, peuvent les voir avant qu'un
            modérateur intervienne.
          </p>
          <p>
            NoHorny repère ces blocs, en extrait les images et les envoie à un serveur de
            classification. Si une image est jugée inappropriée, il supprime les blocs et bannit le
            joueur responsable.
          </p>
          <h2>Le défi</h2>
          <p>
            NoHorny doit traiter les blocs en ralentissant le moins possible la boucle principale du
            jeu.
          </p>
          <p>
            Pour ça, je regroupe les blocs voisins sur plusieurs ticks de jeu, puis je génère
            l'image complète et l'envoie à la classification dans des threads en arrière-plan.
          </p>
          <p>
            Côté serveur de classification, je voulais limiter les coûts. J'utilise donc d'abord un{" "}
            <a
              href="https://huggingface.co/Falconsai/nsfw_image_detection_26?not-for-all-audiences=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              modèle de classification local
            </a>
            . Il est assez précis et l'analyse prend environ 150 ms. Mais une image très grande ou
            inhabituelle peut être signalée à tort.
          </p>
          <p>
            Pour corriger ça, je le combine avec{" "}
            <a href="https://sightengine.com/" target="_blank" rel="noopener noreferrer">
              Sightengine
            </a>
            , un service de modération de contenu. Le modèle local écarte les images clairement
            acceptables et Sightengine vérifie le reste.
          </p>
          <p>
            Ça me permet de proposer un service de classification public et gratuit aux autres
            propriétaires de serveurs.
          </p>
          <h2>En pratique</h2>
          <p>
            Plusieurs réseaux de serveurs Mindustry utilisent maintenant NoHorny. Je continue de
            travailler avec eux pour faciliter son installation et l'adapter à leurs besoins.
          </p>
          <p>
            Par exemple, NoHorny peut envoyer des alertes via les webhooks Discord, mais certains
            serveurs sont hébergés dans des pays où Discord est bloqué. J'ai donc ajouté un outil
            qui récupère des proxys gratuits et fait passer les requêtes des webhooks par ceux-ci.
          </p>
        </>
      );
    },
  } satisfies Content;

  return <>{content[language()]}</>;
}
