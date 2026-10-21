import { Dynamic, type JSX } from "@solidjs/web";
import type { BlockNode, InlineNode, MarkdownDocument } from "@tanstack/markdown";
import type { ProjectImageNode } from "../projects";
import type { MarkdownComponentName } from "../projects/schema";
import { Callout, WhatIsMindustry } from "./Callout";
import { Image } from "./Image";
import styles from "./Markdown.module.css";

// Renders a parsed Markdown document as Solid elements, so links, images and
// comment components (<!-- ::name -->) go through the site's own components.

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function MarkdownImage(props: { node: ProjectImageNode }) {
  return <Image image={props.node} alt={props.node.alt} loading="lazy" />;
}

function images(nodes: BlockNode[]): ProjectImageNode[] {
  return nodes.flatMap((node) =>
    node.type === "paragraph"
      ? node.children.filter((child) => child.type === "image").map(asProjectImage)
      : [],
  );
}

/** tools/projects swaps every image's src for its resolved asset. */
function asProjectImage(node: InlineNode): ProjectImageNode {
  return node as unknown as ProjectImageNode;
}

const components = {
  "what-is-mindustry": () => <WhatIsMindustry />,
  gallery: (children: BlockNode[]) => (
    <div class={styles.gallery}>
      {images(children).map((image) => (
        <MarkdownImage node={image} />
      ))}
    </div>
  ),
} satisfies Record<MarkdownComponentName, (children: BlockNode[]) => JSX.Element>;

function inline(nodes: InlineNode[]): JSX.Element {
  return nodes.map(inlineNode);
}

function blocks(nodes: BlockNode[]): JSX.Element {
  return nodes.map(blockNode);
}

function inlineNode(node: InlineNode): JSX.Element {
  switch (node.type) {
    case "text":
      return node.value;
    case "strong":
      return <strong>{inline(node.children)}</strong>;
    case "emphasis":
      return <em>{inline(node.children)}</em>;
    case "strike":
      return <s>{inline(node.children)}</s>;
    case "inlineCode":
      return <code>{node.value}</code>;
    case "break":
      return <br />;
    case "link":
      return isExternal(node.href) ? (
        <a href={node.href} title={node.title} target="_blank" rel="noopener noreferrer">
          {inline(node.children)}
        </a>
      ) : (
        <a href={node.href} title={node.title}>
          {inline(node.children)}
        </a>
      );
    case "image":
      return <MarkdownImage node={asProjectImage(node)} />;
    case "inlineComponent":
      return <span>{inline(node.children)}</span>;
    case "footnoteReference":
      return (
        <sup>
          <a href={`#footnote-${node.id}`}>{node.number}</a>
        </sup>
      );
    case "inlineHtml":
      return null;
  }
}

function blockNode(node: BlockNode): JSX.Element {
  switch (node.type) {
    case "heading":
      return (
        <Dynamic component={`h${node.depth}`} id={node.id}>
          {inline(node.children)}
        </Dynamic>
      );
    case "paragraph":
      return <p>{inline(node.children)}</p>;
    case "list": {
      const items = node.items.map((item) => (
        <li>
          {/* Tight list items hold a single paragraph; unwrap it like HTML renderers do. */}
          {!node.loose && item.children.length === 1 && item.children[0]?.type === "paragraph"
            ? inline(item.children[0].children)
            : blocks(item.children)}
        </li>
      ));
      return node.ordered ? <ol start={node.start}>{items}</ol> : <ul>{items}</ul>;
    }
    case "blockquote":
      return <blockquote>{blocks(node.children)}</blockquote>;
    case "callout":
      return <Callout title={node.title}>{blocks(node.children)}</Callout>;
    case "component":
      return components[node.name as MarkdownComponentName](node.children);
    case "code":
      return (
        <pre>
          <code>{node.value}</code>
        </pre>
      );
    case "thematicBreak":
      return <hr />;
    case "table":
      return (
        <table>
          <thead>
            <tr>
              {node.header.map((cell, column) => (
                <th style={{ "text-align": node.align[column] }}>{inline(cell.children)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {node.rows.map((row) => (
              <tr>
                {row.map((cell, column) => (
                  <td style={{ "text-align": node.align[column] }}>{inline(cell.children)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "footnotes":
      return (
        <ol>
          {node.items.map((item) => (
            <li id={`footnote-${item.id}`}>{blocks(item.children)}</li>
          ))}
        </ol>
      );
    case "html":
      return null;
  }
}

export function Markdown(props: { document: MarkdownDocument }) {
  return <>{blocks(props.document.children)}</>;
}
