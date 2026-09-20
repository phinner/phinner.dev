import { useLocation } from "@solidjs/router";
import { For, Show } from "solid-js";
import { formatDateRange } from "../lib/dates";
import type { ProjectSummary } from "../projects";
import { isProjectScreenshot, resolveProjectImage } from "../projects/types";
import shared from "../styles/shared.module.css";
import { ChevronRightIcon } from "./Icon";
import { Image } from "./Image";
import { useLanguage } from "./LanguageProvider";
import styles from "./ProjectCard.module.css";

export function ProjectCard(props: { project: ProjectSummary }) {
  const { language } = useLanguage();
  const location = useLocation();
  const project = () => props.project;
  const content = () => project().content[language()];
  const image = () => resolveProjectImage(project().image, language());
  const imageKind = () => (isProjectScreenshot(project().image) ? "screenshot" : "logo");
  const imageLabels = {
    en: {
      logo: (name: string) => `${name} logo`,
      screenshot: (name: string) => `Screenshot of the ${name} website`,
    },
    fr: {
      logo: (name: string) => `Logo de ${name}`,
      screenshot: (name: string) => `Capture du site web de ${name}`,
    },
  };

  return (
    <a
      class={{
        [shared.panel]: true,
        [styles.entry]: true,
        [styles.wide]: isProjectScreenshot(project().image),
      }}
      href={`/projects/${project().name}${location.pathname === "/" ? "?from-home=true" : ""}`}
    >
      <div class={styles.row}>
        <figure
          class={{
            [styles.preview]: true,
            [styles.site]: isProjectScreenshot(project().image),
            [styles.fit]: !isProjectScreenshot(project().image),
          }}
        >
          <Image
            image={image()}
            alt={imageLabels[language()][imageKind()](project().title)}
            loading="lazy"
            fit={imageKind() === "logo" ? "contain" : "cover"}
            position={imageKind() === "screenshot" ? "left top" : "center"}
          />
        </figure>
        <div class={styles.summary}>
          <div class={`${shared.head} ${styles.head}`}>
            <h3>
              {project().title}{" "}
              <Show when={content().role}>
                <span class={shared.roleIn}>/ {content().role}</span>
              </Show>
            </h3>
            <Show when={project().period}>
              {(period) => (
                <span class={`${shared.badge} ${styles.when}`}>
                  {formatDateRange(period(), language())}
                </span>
              )}
            </Show>
          </div>
          <p>{content().description}</p>
          <div class={`${shared.tags} ${styles.tags}`}>
            <For each={project().tags}>{(tag) => <span class={shared.badge}>{tag}</span>}</For>
          </div>
        </div>
      </div>
      <ChevronRightIcon class={styles.go} />
    </a>
  );
}
