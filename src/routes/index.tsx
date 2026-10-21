import { For, Loading, lazy } from "solid-js";
import { BuildingIcon, ChevronRightIcon, GitHubIcon, HammerIcon } from "../components/Icon";
import { useLanguage } from "../components/LanguageProvider";
import { PageMeta } from "../components/PageMeta";
import { ProjectCard } from "../components/ProjectCard";
import { SectionHeader } from "../components/SectionHeader";
import sectionHeaderStyles from "../components/SectionHeader.module.css";
import { TitleCard } from "../components/TitleCard";
import { projectsOnLanding } from "../projects";
import shared from "../styles/shared.module.css";

const GitHubActivity = lazy(() => import("../components/GitHubActivity"), {
  export: "GitHubActivity",
});

export default function Home() {
  const { language } = useLanguage();
  const content = {
    en: {
      work: "Work experience",
      built: "Things I built",
      allProjects: "See all",
      openSource: "Open source",
      description: "Full-stack developer | Belgium",
    },
    fr: {
      work: "Mon expérience",
      built: "Mes projets",
      allProjects: "Voir tout",
      openSource: "Open source",
      description: "Développeur full-stack | Belgique",
    },
  };

  return (
    <div class={shared.view}>
      <PageMeta title="Phinner" description={content[language()].description} />
      <TitleCard />
      <section>
        <SectionHeader title={content[language()].work} icon={BuildingIcon} />
        <div class={shared.stack}>
          <For each={projectsOnLanding("work")}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
      </section>
      <section>
        <SectionHeader title={content[language()].built} icon={HammerIcon}>
          <a class={sectionHeaderStyles.sub} href="/projects">
            {content[language()].allProjects} <ChevronRightIcon class={shared.inlineIcon} />
          </a>
        </SectionHeader>
        <div class={shared.stack}>
          <For each={projectsOnLanding("built")}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
      </section>
      <section>
        <SectionHeader title={content[language()].openSource} icon={GitHubIcon} />
        <Loading>
          <GitHubActivity />
        </Loading>
      </section>
    </div>
  );
}
