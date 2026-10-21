// Turns src/projects/<name>/<language>.md into modules the app can import.
//
//   import meta from "./nohorny/fr.md"        validated frontmatter, as an object
//   import body from "./nohorny/fr.md?body"   the parsed Markdown document
//
// English is the base language: another language's frontmatter only lists the
// fields it changes and is merged over the English one. Relative image paths,
// in the frontmatter or the body, become hashed assets with their dimensions
// and, when a <file>.preview.webp sits next to them, an inline blur preview.

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import type { BlockNode, ImageNode, InlineNode, MarkdownDocument } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { imageSize } from "image-size";
import * as v from "valibot";
import type { Plugin } from "vite";
import { parse as parseYaml } from "yaml";
import { parseLanguage } from "../../src/lib/language.ts";
import { MARKDOWN_COMPONENTS, ProjectMetaSchema } from "../../src/projects/schema.ts";

const BASE_LANGUAGE = "en";
const PROJECT_FILE = /[\\/]src[\\/]projects[\\/][^\\/]+[\\/]([a-z]{2})\.md$/;

export const markdownExtensions = [commentComponentsExtension()];

type Frontmatter = Record<string, unknown>;

function isRecord(value: unknown): value is Frontmatter {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function merge(base: Frontmatter, override: Frontmatter): Frontmatter {
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    merged[key] = isRecord(current) && isRecord(value) ? merge(current, value) : value;
  }
  return merged;
}

function readMarkdown(file: string): MarkdownDocument {
  return parseMarkdown(readFileSync(file, "utf8"), { extensions: markdownExtensions });
}

function frontmatterOf(document: MarkdownDocument, file: string): Frontmatter {
  const data: unknown = parseYaml(document.frontmatter ?? "") ?? {};
  if (!isRecord(data)) throw new Error(`${file}: frontmatter must be a YAML mapping`);
  return data;
}

/** SVGs report rounded width/height attributes, so their viewBox gives the truer ratio. */
function dimensionsOf(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  if (extname(file) === ".svg") {
    const viewBox = /viewBox="\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/.exec(
      bytes.toString("utf8"),
    );
    if (viewBox) {
      const [width, height] = [Number(viewBox[1]), Number(viewBox[2])];
      const scale = Math.max(1, 1000 / Math.max(width, height));
      return { width: Math.round(width * scale), height: Math.round(height * scale) };
    }
  }
  const { width, height } = imageSize(bytes);
  return { width, height };
}

/**
 * Builds a module whose data is JSON, except for the image values, which are
 * swapped for expressions referencing imported assets.
 */
class ModuleWriter {
  private readonly imports: string[] = [];
  private readonly expressions: string[] = [];

  constructor(
    private readonly directory: string,
    private readonly addWatchFile: (file: string) => void,
  ) {}

  /** A placeholder that serialises to the given ImageSource expression. */
  image(path: string, extra: Record<string, unknown> = {}): string {
    if (/^[a-z]+:|^\//i.test(path)) {
      throw new Error(`${path}: images must be relative files next to the Markdown`);
    }
    const file = resolve(this.directory, path);
    if (!existsSync(file)) throw new Error(`${path}: image not found at ${file}`);
    this.addWatchFile(file);

    const index = this.imports.length;
    const specifier = `./${relative(this.directory, file).replaceAll("\\", "/")}`;
    this.imports.push(`import src${index} from ${JSON.stringify(specifier)};`);

    const previewFile = join(dirname(file), `${basename(file, extname(file))}.preview.webp`);
    let preview = "undefined";
    if (existsSync(previewFile)) {
      this.addWatchFile(previewFile);
      const previewSpecifier = `./${relative(this.directory, previewFile).replaceAll("\\", "/")}?inline`;
      this.imports.push(`import preview${index} from ${JSON.stringify(previewSpecifier)};`);
      preview = `preview${index}`;
    }

    const { width, height } = dimensionsOf(file);
    const fields = Object.entries(extra).map(
      ([key, value]) => `${key}: ${JSON.stringify(value)}, `,
    );
    return this.expression(
      `{ ${fields.join("")}src: src${index}, preview: ${preview}, width: ${width}, height: ${height} }`,
    );
  }

  private expression(code: string): string {
    this.expressions.push(code);
    return `__markdown_expression_${this.expressions.length - 1}__`;
  }

  write(value: unknown): string {
    const json = JSON.stringify(value, null, 2).replaceAll(
      /"__markdown_expression_(\d+)__"/g,
      (_, index: string) => this.expressions[Number(index)] ?? "undefined",
    );
    return `${this.imports.join("\n")}\nexport default ${json};\n`;
  }
}

function withImageSources(document: MarkdownDocument, writer: ModuleWriter): MarkdownDocument {
  const inline = (node: InlineNode): InlineNode => {
    if (node.type === "image") {
      const { src, ...rest }: ImageNode = node;
      return writer.image(src, rest) as unknown as InlineNode;
    }
    return "children" in node ? { ...node, children: node.children.map(inline) } : node;
  };

  const block = (node: BlockNode): BlockNode => {
    switch (node.type) {
      case "heading":
      case "paragraph":
        return { ...node, children: node.children.map(inline) };
      case "list":
        return {
          ...node,
          items: node.items.map((item) => ({ ...item, children: item.children.map(block) })),
        };
      case "component":
        if (!MARKDOWN_COMPONENTS.some((name) => name === node.name)) {
          throw new Error(
            `unknown component "${node.name}", expected one of: ${MARKDOWN_COMPONENTS.join(", ")}`,
          );
        }
        return { ...node, children: node.children.map(block) };
      case "blockquote":
      case "callout":
        return { ...node, children: node.children.map(block) };
      case "table":
        return {
          ...node,
          header: node.header.map((cell) => ({ ...cell, children: cell.children.map(inline) })),
          rows: node.rows.map((row) =>
            row.map((cell) => ({ ...cell, children: cell.children.map(inline) })),
          ),
        };
      default:
        return node;
    }
  };

  const { frontmatter: _, ...rest } = document;
  return { ...rest, children: rest.children.map(block) };
}

export function projectContent(): Plugin {
  return {
    name: "phinner.dev:project-content",
    load(id) {
      const [file = "", query = ""] = id.split("?", 2);
      const match = PROJECT_FILE.exec(file);
      if (!match) return;

      const language = parseLanguage(match[1]);
      if (!language) throw new Error(`${file}: unknown language "${match[1]}"`);

      const directory = dirname(file);
      const writer = new ModuleWriter(directory, (watched) => this.addWatchFile(watched));
      const document = readMarkdown(file);

      if (new URLSearchParams(query).has("body")) {
        try {
          return writer.write(withImageSources(document, writer));
        } catch (error) {
          throw new Error(`${file}: ${error instanceof Error ? error.message : error}`);
        }
      }

      let frontmatter = frontmatterOf(document, file);
      if (language !== BASE_LANGUAGE) {
        const baseFile = join(directory, `${BASE_LANGUAGE}.md`);
        this.addWatchFile(baseFile);
        frontmatter = merge(frontmatterOf(readMarkdown(baseFile), baseFile), frontmatter);
      }

      const result = v.safeParse(ProjectMetaSchema, frontmatter);
      if (!result.success) {
        const issues = result.issues.map(
          (issue) => `  ${v.getDotPath(issue) ?? "(root)"}: ${issue.message}`,
        );
        throw new Error(`${file}: invalid frontmatter\n${issues.join("\n")}`);
      }

      const { image, ...meta } = result.output;
      return writer.write({
        name: basename(directory),
        language,
        ...meta,
        image: writer.image(image.src, { kind: image.kind }),
      });
    },
  };
}
