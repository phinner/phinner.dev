import { createSignal, onSettled, Show } from "solid-js";
import shared from "../styles/shared.module.css";
import { Contact, DiscordContact } from "./Contact";
import styles from "./Footer.module.css";
import { ArrowUpIcon } from "./Icon";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { language } = useLanguage();
  const [scrollable, setScrollable] = createSignal(false);
  onSettled(() => {
    const update = () =>
      setScrollable(document.documentElement.scrollHeight > window.innerHeight + 1);
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  });
  const content = {
    en: {
      top: "Back to top",
      commit: "View commit",
    },
    fr: {
      top: "Retour en haut",
      commit: "Voir le commit",
    },
  };

  return (
    <footer class={styles.footer}>
      <div class={`${shared.wrap} ${styles.wrap}`}>
        <span class={styles.meta}>
          © {new Date().getFullYear()} Phinner.
          <Show when={__COMMIT_SHA__}>
            {" "}
            <a
              class={styles.version}
              href={`https://github.com/phinner/phinner.dev/commit/${__COMMIT_SHA__}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${content[language()].commit} ${__COMMIT_SHA__.slice(0, 7)}`}
            >
              {__COMMIT_SHA__.slice(0, 7)}
            </a>
          </Show>
        </span>
        <div class={styles.footActions}>
          <Contact name="mail" compact />
          <Contact name="github" compact />
          <Contact name="twitter" compact />
          <DiscordContact compact />
          <button
            hidden={!scrollable()}
            class={shared.btn}
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            <span class={shared.face}>
              {content[language()].top} <ArrowUpIcon />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
