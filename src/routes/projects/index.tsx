import { For } from "solid-js";
import { HammerIcon } from "../../components/Icon";
import { useLanguage } from "../../components/LanguageProvider";
import { PageMeta } from "../../components/PageMeta";
import { ProjectCard } from "../../components/ProjectCard";
import { SectionHeader } from "../../components/SectionHeader";
import { projects } from "../../projects";
import shared from "../../styles/shared.module.css";

export default function Projects() {
  const { language } = useLanguage();
  const content = {
    en: {
      allProjects: "My projects",
      description: "A few software projects I've worked on.",
    },
    fr: {
      allProjects: "Mes projets",
      description: "Quelques projets sur lesquels j'ai travaillé.",
    },
  };

  return (
    <div class={shared.view}>
      <PageMeta
        title={content[language()].allProjects}
        description={content[language()].description}
      />
      <section>
        <SectionHeader heading="h1" title={content[language()].allProjects} icon={HammerIcon} />
        <div class={shared.stack}>
          <For each={projects}>{(project) => <ProjectCard project={project} />}</For>
        </div>
      </section>
    </div>
  );
}
