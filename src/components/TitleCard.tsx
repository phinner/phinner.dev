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
            👋 Hi there, I'm a full-stack developer based in Belgium 🇧🇪.
            <br />I build game server tooling and web apps.
          </p>
          <p class={styles.cta}>I am also looking for job opportunities. Feel free to reach out!</p>
        </>
      );
    },
    get fr() {
      return (
        <>
          <p>👋 Salutations, je suis développeur full-stack en Belgique 🇧🇪.</p>
          <p class={styles.cta}>
            Je suis disponible pour vous accompagner dans vos projets informatiques. Besoin de
            conseils, d'un site web ou d'une application interne pour votre entreprise ? Envoyez-moi
            un message !
          </p>
        </>
      );
    },
  } satisfies Content;

  return <>{content[language()]}</>;
}
