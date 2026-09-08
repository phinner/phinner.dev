import type { ParentProps } from "solid-js";
import styles from "./Callout.module.css";
import { useLanguage } from "./LanguageProvider";

export function Callout(props: ParentProps<{ title: string }>) {
  return (
    <details class={styles.callout}>
      <summary>{props.title}</summary>
      <div class={styles.content}>{props.children}</div>
    </details>
  );
}

export function WhatIsMindustry() {
  const { language } = useLanguage();
  const content = {
    en: {
      title: "What is Mindustry?",
      get content() {
        return (
          <p>
            It's an open-source game combining factory-building and tower defense. If you like
            Factorio,{" "}
            <a href="https://github.com/anuken/mindustry" target="_blank" rel="noopener noreferrer">
              you should check it out
            </a>
            .
          </p>
        );
      },
    },
    fr: {
      title: "C'est quoi Mindustry ?",
      get content() {
        return (
          <p>
            C'est un jeu open source qui mélange construction d'usines et tower defense. Si vous
            aimez Factorio,{" "}
            <a href="https://github.com/anuken/mindustry" target="_blank" rel="noopener noreferrer">
              allez y jeter un œil
            </a>
            .
          </p>
        );
      },
    },
  };
  return <Callout title={content[language()].title}>{content[language()].content}</Callout>;
}
