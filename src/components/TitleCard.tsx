import shared from "../styles/shared.module.css";
import { Contact, DiscordContact } from "./Contact";
import { type Content, useLanguage } from "./LanguageProvider";
import { MyLogo } from "./MyLogo";
import styles from "./TitleCard.module.css";

export function TitleCard() {
  const { language } = useLanguage();
  const role = {
    en: "Full-stack developer",
    fr: "Développeur full-stack",
  } satisfies Content;

  return (
    <header class={`${shared.panel} ${styles.profile}`}>
      <div class={styles.ident}>
        <div>
          <h1>Phinner</h1>
          <div class={styles.role}>{role[language()]}</div>
        </div>
        <MyLogo />
      </div>
      <Introduction />
      <div class={styles.contacts}>
        <Contact name="github" />
        <Contact name="twitter" />
        <DiscordContact />
        <Contact name="mail" />
      </div>
    </header>
  );
}

function Introduction() {
  const { language } = useLanguage();
  const content = {
    get en() {
      return (
        <>
          <p>
            👋 Hi there, I'm a computer science student and full-stack developer based in Belgium
            🇧🇪.
            <br />I primarily build game server tooling and web apps.
          </p>
          <p class={styles.cta}>
            I'm open to part-time work. Need a website or an internal app for your business, or just
            want to chat? I'm only one message away!
          </p>
        </>
      );
    },
    get fr() {
      return (
        <>
          <p>
            👋 Salutations, je suis étudiant en informatique et développeur full-stack en Belgique
            🇧🇪.
            <br />
            Je développe surtout des outils pour serveurs de jeu et des applications web.
          </p>
          <p class={styles.cta}>
            Je suis disponible pour du travail à temps partiel. Besoin d'un site web ou d'une
            application interne pour votre entreprise, ou juste envie de discuter ? Envoyez-moi un
            message !
          </p>
        </>
      );
    },
  } satisfies Content;

  return <>{content[language()]}</>;
}
