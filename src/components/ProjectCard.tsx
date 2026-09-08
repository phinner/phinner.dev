import { useLocation } from "@solidjs/router";
import { For, Show } from "solid-js";
import { formatDateRange } from "../lib/dates";
import type { ProjectSummary } from "../projects";
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

  return (
    <a
      class={{
        [shared.panel]: true,
        [styles.entry]: true,
        [styles.wide]: project().image.kind === "screenshot",
      }}
      href={`/projects/${project().name}${location.pathname === "/" ? "?from-home=true" : ""}`}
    >
      <div class={styles.row}>
        <figure
          class={{
            [styles.preview]: true,
            [styles.site]: project().image.kind === "screenshot",
            [styles.fit]: project().image.kind === "logo",
          }}
        >
          <Image
            image={project().image}
            alt=""
            loading="lazy"
            fit={project().image.kind === "logo" ? "contain" : "cover"}
            position={project().image.kind === "screenshot" ? "left top" : "center"}
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
