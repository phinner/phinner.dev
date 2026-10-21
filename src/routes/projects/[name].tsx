import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { ProjectPage } from "../../components/ProjectPage";
import { findProject } from "../../projects";
import NotFound from "../NotFound";

export default function Project() {
  const params = useParams();

  return (
    <Show when={findProject(params.name ?? "")} keyed fallback={<NotFound />}>
      {(project) => <ProjectPage project={project} />}
    </Show>
  );
}
