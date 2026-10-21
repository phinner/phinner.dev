import * as v from "valibot";

// The frontmatter every project's Markdown starts with. tools/projects checks it
// at build time, so a typo fails the dev server instead of rendering a blank card.

const PartialDateSchema = v.pipe(
  v.union([v.number(), v.string()]),
  v.transform(String),
  v.regex(/^\d{4}(-\d{2})?$/, "Dates are written YYYY or YYYY-MM"),
  v.transform((value) => {
    const [year, month] = value.split("-").map(Number);
    return month === undefined ? { year } : { year, month: month - 1 };
  }),
);

export const ProjectMetaSchema = v.strictObject({
  title: v.string(),
  description: v.string(),
  /** Shown after the title, e.g. "RTeam / Full-stack developer". */
  role: v.optional(v.string()),
  tags: v.array(v.string()),
  period: v.optional(
    v.strictObject({
      start: PartialDateSchema,
      end: v.union([v.literal("now"), PartialDateSchema]),
    }),
  ),
  /** Which home page section lists the project. Left out, it only shows on /projects. */
  landing: v.optional(v.picklist(["work", "built"])),
  /** Position in every list, lowest first. */
  order: v.number(),
  image: v.strictObject({
    kind: v.picklist(["logo", "screenshot"]),
    src: v.string(),
  }),
  /**
   * Buttons on the project page, in order. Keyed by a name of your choice so
   * another language can relabel one without repeating the rest.
   */
  links: v.record(
    v.string(),
    v.strictObject({
      href: v.pipe(v.string(), v.url()),
      label: v.string(),
      icon: v.optional(v.picklist(["github", "website"])),
    }),
  ),
});

export type ProjectMetaSource = v.InferOutput<typeof ProjectMetaSchema>;

/** Comment components a project body may use, e.g. <!-- ::what-is-mindustry -->. */
export const MARKDOWN_COMPONENTS = ["what-is-mindustry", "gallery"] as const;

export type MarkdownComponentName = (typeof MARKDOWN_COMPONENTS)[number];
