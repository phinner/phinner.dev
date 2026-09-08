import { getRequestEvent, isServer } from "@solidjs/web";
import { useLanguage } from "../components/LanguageProvider";
import { PageMeta } from "../components/PageMeta";
import styles from "../components/TitleCard.module.css";
import shared from "../styles/shared.module.css";

export default function NotFound() {
  const { language } = useLanguage();
  const content = {
    en: {
      notFound: "Page not found",
      notFoundBody: "You got lost. It happens 😔",
      home: "Home",
    },
    fr: {
      notFound: "Page introuvable",
      notFoundBody: "Vous vous êtes perdu. Ça arrive 😔",
      home: "Accueil",
    },
  };

  if (isServer) {
    const event = getRequestEvent();
    if (event && !event.response.committed) event.response.status = 404;
  }

  return (
    <article class={`${shared.panel} ${styles.profile}`}>
      <PageMeta
        title={content[language()].notFound}
        description={content[language()].notFoundBody}
      />
      <h1>{content[language()].notFound}</h1>
      <p>{content[language()].notFoundBody}</p>
      <div>
        <a class={shared.btn} href="/">
          <span class={shared.face}>{content[language()].home}</span>
        </a>
      </div>
    </article>
  );
}
