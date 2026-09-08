import { summary as imperiumSummary } from "./imperium.summary";
import { summary as nohornySummary } from "./nohorny.summary";
import { summary as rteamSummary } from "./rteam.summary";
import { PROJECT_NAMES, type ProjectName, type ProjectSummary } from "./types";

export type { ProjectName, ProjectSummary } from "./types";

export { PROJECT_NAMES } from "./types";

export const projects: Record<ProjectName, ProjectSummary> = {
  nohorny: nohornySummary,
  imperium: imperiumSummary,
  rteam: rteamSummary,
};

export function findProject(name: string): ProjectSummary | undefined {
  const key = PROJECT_NAMES.find((candidate) => candidate === name);
  return key === undefined ? undefined : projects[key];
}
