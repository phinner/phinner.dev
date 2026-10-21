import type { ImageNode, MarkdownDocument } from "@tanstack/markdown";
import type { ImageSource } from "../components/Image";
import type { Content } from "../components/LanguageProvider";
import type { DateRange } from "../lib/dates";
import type { Language } from "../lib/language";
import type { ProjectMetaSource } from "./schema";

// Every project is a folder holding one Markdown file per language. Adding a
// folder is all it takes for a project to show up; see tools/projects for how
// the files are turned into modules.

export type ProjectImage = ImageSource & { kind: "logo" | "screenshot" };

/** An image node in a project body, carrying its resolved asset. */
export type ProjectImageNode = Omit<ImageNode, "src"> & ImageSource;

export type ProjectMeta = Omit<ProjectMetaSource, "image" | "period"> & {
  name: string;
  language: Language;
  image: ProjectImage;
  period?: DateRange;
};

export type Project = { name: string; content: Content<ProjectMeta> };

const metaFiles = import.meta.glob<ProjectMeta>("./*/*.md", { eager: true, import: "default" });
const bodyFiles = import.meta.glob<MarkdownDocument>("./*/*.md", {
  query: "?body",
  import: "default",
});

function projectFile(name: string, language: Language): string {
  return `./${name}/${language}.md`;
}

export const projects: Project[] = Object.values(metaFiles)
  .filter((meta) => meta.language === "en")
  .map(({ name }) => {
    const content = (language: Language) => {
      const meta = metaFiles[projectFile(name, language)];
      if (!meta) throw new Error(`Project "${name}" has no ${language}.md`);
      return meta;
    };
    return { name, content: { en: content("en"), fr: content("fr") } };
  })
  .sort((a, b) => a.content.en.order - b.content.en.order);

export const projectNames = projects.map((project) => project.name);

export function findProject(name: string): Project | undefined {
  return projects.find((project) => project.name === name);
}

export function projectsOnLanding(section: NonNullable<ProjectMeta["landing"]>): Project[] {
  return projects.filter((project) => project.content.en.landing === section);
}

export function loadProjectBody(name: string, language: Language): Promise<MarkdownDocument> {
  const load = bodyFiles[projectFile(name, language)];
  if (!load) throw new Error(`Project "${name}" has no ${language}.md`);
  return load();
}
