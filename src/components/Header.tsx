import { useLocation } from "@solidjs/router";
import shared from "../styles/shared.module.css";
import styles from "./Header.module.css";
import { MoonIcon, SunIcon } from "./Icon";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { language, changeLanguage } = useLanguage();
  const location = useLocation();
  const content = {
    en: {
      home: "Home",
      projects: "Projects",
      nav: "Primary navigation",
      light: "Switch to light mode",
      dark: "Switch to dark mode",
    },
    fr: {
      home: "Accueil",
      projects: "Projets",
      nav: "Navigation principale",
      light: "Passer au thème clair",
      dark: "Passer au thème sombre",
    },
  };
  const { theme, ready, toggleTheme } = useTheme();

  return (
    <nav class={styles.topbar} aria-label={content[language()].nav}>
      <div class={`${shared.wrap} ${styles.wrap}`}>
        <a
          class={styles.navLink}
          href="/"
          aria-current={location.pathname === "/" ? "page" : undefined}
        >
          {content[language()].home}
        </a>
        <a
          class={styles.navLink}
          href="/projects"
          aria-current={location.pathname.startsWith("/projects") ? "page" : undefined}
        >
          {content[language()].projects}
        </a>
        <span class={styles.navFill} />
        <button
          class={`${styles.navLink} ${styles.lang}`}
          type="button"
          disabled={!ready()}
          onClick={() => changeLanguage(language() === "en" ? "fr" : "en")}
          aria-label={language() === "en" ? "Passer en français" : "Switch to English"}
        >
          <span class={{ [styles.on]: language() === "en" }} lang="en">
            EN
          </span>
          <span class={styles.sep}>/</span>
          <span class={{ [styles.on]: language() === "fr" }} lang="fr">
            FR
          </span>
        </button>
        <button
          class={`${styles.navLink} ${styles.theme}`}
          type="button"
          disabled={!ready()}
          aria-label={theme() === "light" ? content[language()].dark : content[language()].light}
          onClick={toggleTheme}
        >
          <SunIcon class={styles.sun} />
          <MoonIcon class={styles.moon} />
        </button>
      </div>
    </nav>
  );
}
