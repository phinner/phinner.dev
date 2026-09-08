import { useParams } from "@solidjs/router";
import { Dynamic } from "@solidjs/web";
import { type Component, lazy, Show } from "solid-js";
import { ProjectPage } from "../../components/ProjectPage";
import { findProject, type ProjectName } from "../../projects";
import NotFound from "../NotFound";

const deepDives = {
  nohorny: lazy(() => import("../../projects/nohorny"), { export: "DeepDive" }),
  imperium: lazy(() => import("../../projects/imperium"), { export: "DeepDive" }),
  rteam: lazy(() => import("../../projects/rteam"), { export: "DeepDive" }),
} satisfies Record<ProjectName, Component>;

export default function Project() {
  const params = useParams();

  return (
    <Show when={findProject(params.name ?? "")} keyed fallback={<NotFound />}>
      {(project) => (
        <ProjectPage project={project}>
          <Dynamic component={deepDives[project.name]} />
        </ProjectPage>
      )}
    </Show>
  );
}
