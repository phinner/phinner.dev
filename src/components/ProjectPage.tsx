import { useSearchParams } from "@solidjs/router";
import { Dynamic } from "@solidjs/web";
import { createMemo, For, Loading, Show } from "solid-js";
import { formatDateRange } from "../lib/dates";
import { loadProjectBody, type Project } from "../projects";
import shared from "../styles/shared.module.css";
import { ChevronLeftIcon, GitHubIcon } from "./Icon";
import { Image } from "./Image";
import { useLanguage } from "./LanguageProvider";
import { Markdown } from "./Markdown";
import { PageMeta } from "./PageMeta";
import styles from "./ProjectPage.module.css";

const linkIcons = { github: GitHubIcon };

export function ProjectPage(props: { project: Project }) {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const fromHome = () => searchParams["from-home"] === "true";
  const summary = () => props.project.content[language()];
  const isScreenshot = () => summary().image.kind === "screenshot";
  const body = createMemo(() => loadProjectBody(props.project.name, language()));
  const content = {
    en: {
      logo: (name: string) => `${name} logo`,
      back: "Back to projects",
      home: "Back to home",
      screenshot: (name: string) => `Screenshot of the ${name} website`,
    },
    fr: {
      logo: (name: string) => `Logo de ${name}`,
      back: "Retour aux projets",
      home: "Retour à l'accueil",
      screenshot: (name: string) => `Capture du site web de ${name}`,
    },
  };

  return (
    <div class={`${shared.view} ${styles.detail}`}>
      <PageMeta title={summary().title} description={summary().description} />
      <header class={`${shared.panel} ${styles.hero}`}>
        <Show when={isScreenshot()}>
          <figure class={styles.cover}>
            <Image
              image={summary().image}
              alt={content[language()].screenshot(summary().title)}
              position="center top"
            />
          </figure>
        </Show>
        <div class={styles.body}>
          <div class={styles.titleRow}>
            <a
              class={`${shared.btn} ${shared.square} ${styles.back}`}
              href={fromHome() ? "/" : "/projects"}
              aria-label={fromHome() ? content[language()].home : content[language()].back}
            >
              <span class={shared.face}>
                <ChevronLeftIcon />
              </span>
            </a>
            <h1>
              {summary().title}{" "}
              <Show when={summary().role}>
                <span class={`${shared.roleIn} ${styles.roleIn}`}>/ {summary().role}</span>
              </Show>
            </h1>
            <Show when={!isScreenshot()}>
              <span class={styles.mark}>
                <Image
                  image={summary().image}
                  alt={content[language()].logo(summary().title)}
                  fit="contain"
                />
              </span>
            </Show>
            <Show when={summary().period}>
              {(period) => (
                <span class={`${shared.badge} ${styles.badge}`}>
                  {formatDateRange(period(), language())}
                </span>
              )}
            </Show>
          </div>
          <p class={styles.lede}>{summary().description}</p>
          <div class={shared.tags}>
            <For each={summary().tags}>
              {(tag) => <span class={`${shared.badge} ${styles.badge}`}>{tag}</span>}
            </For>
          </div>
          <div class={shared.actions}>
            <a
              class={`${shared.btn} ${shared.small}`}
              href={summary().link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class={shared.face}>
                <Show when={summary().link.icon}>
                  {(icon) => <Dynamic component={linkIcons[icon()]} />}
                </Show>
                {summary().link.label}
              </span>
            </a>
          </div>
        </div>
      </header>
      <Loading>
        <article class={`${shared.panel} ${styles.prose} ${shared.slideIn}`}>
          <Markdown document={body()} />
        </article>
      </Loading>
    </div>
  );
}
