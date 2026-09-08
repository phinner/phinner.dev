import { Dynamic } from "@solidjs/web";
import type { ParentProps } from "solid-js";
import { For, Show } from "solid-js";
import { formatDateRange } from "../lib/dates";
import type { ProjectSummary } from "../projects";
import shared from "../styles/shared.module.css";
import { ChevronLeftIcon } from "./Icon";
import { Image } from "./Image";
import { useLanguage } from "./LanguageProvider";
import { PageMeta } from "./PageMeta";
import styles from "./ProjectPage.module.css";

export function ProjectPage(props: ParentProps<{ project: ProjectSummary }>) {
  const { language } = useLanguage();
  const project = () => props.project;
  const summary = () => project().content[language()];
  const content = {
    en: {
      back: "Back to projects",
      screenshot: (name: string) => `Screenshot of the ${name} website`,
    },
    fr: {
      back: "Retour aux projets",
      screenshot: (name: string) => `Capture du site web de ${name}`,
    },
  };

  return (
    <div class={`${shared.view} ${styles.detail}`}>
      <PageMeta title={project().title} description={summary().description} />
      <header class={`${shared.panel} ${styles.hero}`}>
        <Show when={project().image.kind === "screenshot"}>
          <figure class={styles.cover}>
            <Image
              image={project().image}
              alt={content[language()].screenshot(project().title)}
              position="center top"
            />
          </figure>
        </Show>
        <div class={styles.body}>
          <div class={styles.titleRow}>
            <a
              class={`${shared.btn} ${shared.square} ${styles.back}`}
              href="/projects"
              aria-label={content[language()].back}
            >
              <span class={shared.face}>
                <ChevronLeftIcon />
              </span>
            </a>
            <h1>
              {project().title}{" "}
              <Show when={summary().role}>
                <span class={`${shared.roleIn} ${styles.roleIn}`}>/ {summary().role}</span>
              </Show>
            </h1>
            <Show when={project().image.kind === "logo"}>
              <span class={styles.mark}>
                <Image image={project().image} alt="" fit="contain" />
              </span>
            </Show>
            <Show when={project().period}>
              {(period) => (
                <span class={`${shared.badge} ${styles.badge}`}>
                  {formatDateRange(period(), language())}
                </span>
              )}
            </Show>
          </div>
          <p class={styles.lede}>{summary().description}</p>
          <div class={shared.tags}>
            <For each={project().tags}>
              {(tag) => <span class={`${shared.badge} ${styles.badge}`}>{tag}</span>}
            </For>
          </div>
          <div class={shared.actions}>
            <a
              class={`${shared.btn} ${shared.small}`}
              href={project().link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class={shared.face}>
                <Show when={project().link.icon}>{(icon) => <Dynamic component={icon()} />}</Show>
                {project().link.label[language()]}
              </span>
            </a>
          </div>
        </div>
      </header>
      <article class={`${shared.panel} ${styles.prose}`}>{props.children}</article>
    </div>
  );
}
