import { createMemo, For, onSettled, Show } from "solid-js";
import { dateContent } from "../lib/dates";
import { githubActivity } from "../lib/queries";
import shared from "../styles/shared.module.css";
import styles from "./GitHubActivity.module.css";
import { ArrowUpRightIcon, GitPullRequestIcon } from "./Icon";
import { useLanguage } from "./LanguageProvider";

const levels = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function scrollToLatest(el: HTMLElement) {
  onSettled(() => {
    el.scrollLeft = el.scrollWidth;
  });
}

export function GitHubActivity() {
  const { language } = useLanguage();
  const content = {
    en: {
      activity: "GitHub activity",
      days: ["", "Mon", "", "Wed", "", "Fri", ""],
      contributions: "contributions in the last year",
      dailyContributions: (count: number) =>
        `${count.toLocaleString("en")} ${count === 1 ? "contribution" : "contributions"}`,
      less: "Less",
      more: "More",
      unavailable: "The graph is unavailable right now. You can still view my activity on GitHub.",
      pullRequests: "Recent pull requests",
    },
    fr: {
      activity: "Activité GitHub",
      days: ["", "lun.", "", "mer.", "", "ven.", ""],
      contributions: "contributions sur les 12 derniers mois",
      dailyContributions: (count: number) =>
        `${count.toLocaleString("fr")} ${count > 1 ? "contributions" : "contribution"}`,
      less: "Moins",
      more: "Plus",
      unavailable:
        "Le graphique est indisponible pour le moment. Mon activité reste visible sur GitHub.",
      pullRequests: "Pull requests récentes",
    },
  };
  const activity = createMemo(() => githubActivity());
  const calendar = () => activity()?.calendar;
  const format = createMemo(
    () => new Intl.DateTimeFormat(language(), { dateStyle: "long", timeZone: "UTC" }),
  );
  const days = createMemo(() => calendar()?.weeks.flatMap((week) => week.contributionDays) ?? []);
  const months = createMemo(() => {
    const weeks = calendar()?.weeks;
    if (!weeks) return [];

    let lastMonth = "",
      lastWeek = -4;

    return weeks.flatMap((week, index) => {
      const first = week.contributionDays[0];
      if (!first) return [];
      const month = dateContent[language()].months[new Date(first.date).getUTCMonth()];
      if (month === lastMonth || index - lastWeek < 3 || index > weeks.length - 3) return [];
      lastMonth = month;
      lastWeek = index;
      return [{ month, index }];
    });
  });

  return (
    <article class={`${shared.panel} ${styles.oss}`}>
      <div class={styles.activity}>
        <Show
          when={calendar()}
          fallback={
            <p class={styles.graphUnavailable}>
              {content[language()].unavailable}{" "}
              <a href="https://github.com/phinner" target="_blank" rel="noopener noreferrer">
                @phinner <ArrowUpRightIcon class={shared.inlineIcon} />
              </a>
            </p>
          }
        >
          {(value) => (
            <>
              <div class={styles.graphInner}>
                <div class={styles.days} aria-hidden="true">
                  <For each={content[language()].days}>{(label) => <span>{label}</span>}</For>
                </div>
                <section
                  class={styles.scroller}
                  ref={scrollToLatest}
                  tabindex="0"
                  aria-label={content[language()].activity}
                >
                  <div class={styles.months} aria-hidden="true">
                    <For each={months()}>
                      {({ month, index }) => (
                        <span style={`grid-column:${index + 1} / span 3`}>{month}</span>
                      )}
                    </For>
                  </div>
                  <div class={styles.cells}>
                    <For each={days()}>
                      {(day) => (
                        <i
                          class={styles.cell}
                          data-l={levels[day.contributionLevel]}
                          style={`grid-row:${new Date(day.date).getUTCDay() + 1}`}
                          title={`${content[language()].dailyContributions(day.contributionCount)} | ${format().format(new Date(day.date))}`}
                        />
                      )}
                    </For>
                  </div>
                </section>
              </div>
              <div class={styles.graphFoot}>
                <span>
                  {value().totalContributions.toLocaleString(language())}{" "}
                  {content[language()].contributions}
                </span>
                <span class={styles.legend} aria-hidden="true">
                  {content[language()].less}{" "}
                  <For each={[0, 1, 2, 3, 4]}>
                    {(level) => <i class={styles.cell} data-l={level} />}
                  </For>{" "}
                  {content[language()].more}
                </span>
              </div>
            </>
          )}
        </Show>
      </div>
      <Show when={activity()?.pullRequests.length}>
        <section aria-label={content[language()].pullRequests}>
          <For each={activity()?.pullRequests}>
            {(pr) => (
              <a
                class={styles.pr}
                href={pr.url}
                data-state={pr.state}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitPullRequestIcon class={styles.prIcon} />
                <span class={styles.prTitle}>{pr.title}</span>
                <span class={styles.prMeta}>
                  <b>{pr.repository.nameWithOwner}</b> #{pr.number}
                </span>
              </a>
            )}
          </For>
        </section>
      </Show>
    </article>
  );
}
