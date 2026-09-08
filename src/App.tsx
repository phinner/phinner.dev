import styles from "./App.module.css";
import { ThemeProvider } from "./components/ThemeProvider";
import shared from "./styles/shared.module.css";
import "@fontsource/momo-trust-display/latin-400.css";
import "./styles/global.css";
import { createRouter } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import { Clouds } from "./components/Clouds";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { type Content, LanguageProvider, useLanguage } from "./components/LanguageProvider";
import { NavigationTransitions } from "./components/NavigationTransitions";
import Home from "./routes/index";
import NotFound from "./routes/NotFound";
import Project from "./routes/projects/[name]";
import Projects from "./routes/projects/index";

const Router = createRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/projects", component: Projects },
    { path: "/projects/:name", component: Project },
    { path: "*404", component: NotFound },
  ],
});

export default function App() {
  return (
    <Router>
      {(props) => (
        <LanguageProvider>
          <ThemeProvider>
            <Shell>{props.children}</Shell>
          </ThemeProvider>
        </LanguageProvider>
      )}
    </Router>
  );
}

function Shell(props: ParentProps) {
  const { language } = useLanguage();
  const content = {
    en: "Skip to content",
    fr: "Aller au contenu",
  } satisfies Content;

  return (
    <div class={styles.shell}>
      <NavigationTransitions />
      <Clouds />
      <a class={styles.skipLink} href="#main">
        {content[language()]}
      </a>
      <Header />
      <main class={`${shared.wrap} ${styles.page}`} id="main" tabindex="-1">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
