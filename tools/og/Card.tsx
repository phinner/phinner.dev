// Solid renders this fixed card to HTML; Takumi lays out the supported inline CSS.
// SVG masks and clip paths travel as image data URIs because Takumi handles them
// reliably there, while their JSX drawings remain shared with the website.

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { type JSX, NoHydration, renderToString } from "@solidjs/web";
import { Renderer } from "@takumi-rs/core";
import { fromHtml } from "@takumi-rs/helpers/html";
import { For, Show } from "solid-js";
import {
  CLOUD_HEIGHT,
  CLOUD_OUTLINE_WIDTH,
  CloudShape,
  createCloudShape,
  mulberry32,
} from "../../src/components/CloudShape";
import { LogoMark } from "../../src/components/LogoMark";
import type { Language } from "../../src/lib/language";
import { OG_CARD_HEIGHT, OG_CARD_WIDTH, type OgCardKey } from "../../src/lib/og";
import { PROJECT_NAMES, projects } from "../../src/projects";

const require = createRequire(import.meta.url);

const FONT_FILES = [
  "@fontsource/momo-trust-display/files/momo-trust-display-latin-400-normal.woff2",
  "@fontsource/momo-trust-display/files/momo-trust-display-latin-ext-400-normal.woff2",
  "@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2",
  "@fontsource-variable/martian-mono/files/martian-mono-latin-ext-wght-normal.woff2",
];

const color = {
  page: "#0b1218",
  panel: "#1c252c",
  panelSunk: "#121a20",
  ink: "#f0f3f6",
  inkMuted: "#bcc4ca",
  inkFaint: "#838b93",
  lineSoft: "#323b43",
  accent: "#41c1ba",
} as const;

const PADDING = 80;
const MARK_SIZE = 620;
const MARK_OVERHANG = 108;
const CLOUD_COUNT = 6;
const FAR_CLOUD_WIDTH = 140;
const NEAR_CLOUD_WIDTH = 300;
const CLOUD_SIZE_VARIATION = 0.15;
const VERTICAL_SLOT_MARGIN = 0.15;
const HORIZONTAL_OVERHANG = 0.1;
const NEAR_DEPTH_THRESHOLD = 0.55;
const FLIP_PROBABILITY = 0.5;

interface CardCopy {
  title: string;
  subtitle: string;
  description?: string;
}

const cardDetails = {
  home: { path: "phinner.dev", seed: 41 },
  projects: { path: "phinner.dev/projects", seed: 9 },
  nohorny: { path: "phinner.dev/projects/nohorny", seed: 3 },
  imperium: { path: "phinner.dev/projects/imperium", seed: 12 },
  rteam: { path: "phinner.dev/projects/rteam", seed: 77 },
  "not-found": { path: "phinner.dev", seed: 55 },
} satisfies Record<OgCardKey, { path: string; seed: number }>;

const siteCopy = {
  home: {
    en: { title: "Phinner", subtitle: "Full-stack developer · Belgium" },
    fr: { title: "Phinner", subtitle: "Développeur full-stack · Belgique" },
  },
  projects: {
    en: {
      title: "Projects",
      description: "A few software projects I've worked on.",
    },
    fr: {
      title: "Mes projets",
      description: "Quelques projets sur lesquels j'ai travaillé.",
    },
  },
  "not-found": {
    en: {
      title: "Page not found",
      subtitle: "Error 404",
      description: "You got lost. It happens.",
    },
    fr: {
      title: "Page introuvable",
      subtitle: "Erreur 404",
      description: "Vous vous êtes perdu. Ça arrive.",
    },
  },
} as const;

let renderer: Promise<Renderer> | undefined;

function getRenderer(): Promise<Renderer> {
  renderer ??= (async () => {
    const instance = new Renderer();
    for (const specifier of FONT_FILES) {
      await instance.registerFont(await readFile(require.resolve(specifier)));
    }
    return instance;
  })();
  return renderer;
}

function copyFor(key: OgCardKey, language: Language): CardCopy {
  switch (key) {
    case "home":
      return siteCopy.home[language];
    case "projects":
      return {
        ...siteCopy.projects[language],
        subtitle: PROJECT_NAMES.map((name) => projects[name].title).join(" · "),
      };
    case "not-found":
      return siteCopy["not-found"][language];
    default: {
      const project = projects[key];
      return {
        title: project.title,
        subtitle: project.tags.join(" · "),
        description: project.content[language].description,
      };
    }
  }
}

function titleSize(title: string): number {
  if (title.length <= 9) return 108;
  if (title.length <= 12) return 96;
  if (title.length <= 16) return 80;
  return 68;
}

function subtitleSize(subtitle: string): number {
  return subtitle.length <= 34 ? 25 : 21;
}

function descriptionSize(description: string): number {
  if (description.length <= 70) return 29;
  if (description.length <= 100) return 26;
  return 24;
}

function withoutSolidComments(html: string): string {
  return html.replaceAll(/<!--[\s\S]*?-->/g, "");
}

function markup(view: () => JSX.Element): string {
  return withoutSolidComments(
    renderToString(() => <NoHydration>{view()}</NoHydration>, { noScripts: true }),
  );
}

function svgUri(view: () => JSX.Element): string {
  return `data:image/svg+xml;base64,${Buffer.from(markup(view)).toString("base64")}`;
}

const markUri = svgUri(() => (
  <LogoMark color={color.accent} innerFill={color.page} clipId="og-logo-clip" />
));

interface CardCloud {
  uri: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

function cardClouds(seed: number): CardCloud[] {
  const random = mulberry32(seed);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return Array.from({ length: CLOUD_COUNT }, (_, index) => {
    const shape = createCloudShape(random, `og-cloud-${index}`);
    const depth = random();
    const near = depth > NEAR_DEPTH_THRESHOLD;
    const size =
      lerp(FAR_CLOUD_WIDTH, NEAR_CLOUD_WIDTH, depth) *
      lerp(1 - CLOUD_SIZE_VARIATION, 1 + CLOUD_SIZE_VARIATION, random());
    const top =
      ((index + VERTICAL_SLOT_MARGIN + random() * (1 - 2 * VERTICAL_SLOT_MARGIN)) / CLOUD_COUNT) *
      OG_CARD_HEIGHT;
    const left = (random() - HORIZONTAL_OVERHANG) * OG_CARD_WIDTH;
    const flip = random() < FLIP_PROBABILITY;
    const uri = svgUri(() => (
      <CloudShape
        cloud={shape}
        bodyFill={near ? color.panel : color.panelSunk}
        outlineStroke={color.lineSoft}
        padded
        flip={flip}
      />
    ));
    const frameRatio =
      (shape.width + 2 * CLOUD_OUTLINE_WIDTH) / (CLOUD_HEIGHT + 2 * CLOUD_OUTLINE_WIDTH);

    return {
      uri,
      width: Math.round(size),
      height: Math.round(size / frameRatio),
      left: Math.round(left),
      top: Math.round(top),
    };
  });
}

function OgCard(props: { cardKey: OgCardKey; language: Language }) {
  const details = cardDetails[props.cardKey];
  const copy = copyFor(props.cardKey, props.language);

  return (
    <div
      style={{
        position: "relative",
        width: `${OG_CARD_WIDTH}px`,
        height: `${OG_CARD_HEIGHT}px`,
        display: "flex",
        "align-items": "center",
        overflow: "hidden",
        background: color.page,
        "font-family": "Momo Trust Display",
        "letter-spacing": "0.02em",
        color: color.ink,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${OG_CARD_WIDTH}px`,
          height: `${OG_CARD_HEIGHT}px`,
          overflow: "hidden",
        }}
      >
        <For each={cardClouds(details.seed)}>
          {(cloud) => (
            <img
              src={cloud.uri}
              alt=""
              style={{
                position: "absolute",
                left: `${cloud.left}px`,
                top: `${cloud.top}px`,
                width: `${cloud.width}px`,
                height: `${cloud.height}px`,
              }}
            />
          )}
        </For>
      </div>
      <img
        src={markUri}
        alt=""
        style={{
          position: "absolute",
          left: `${OG_CARD_WIDTH - MARK_SIZE + MARK_OVERHANG}px`,
          top: `${Math.round((OG_CARD_HEIGHT - MARK_SIZE) / 2)}px`,
          width: `${MARK_SIZE}px`,
          height: `${MARK_SIZE}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${OG_CARD_WIDTH}px`,
          height: `${OG_CARD_HEIGHT}px`,
          "background-image":
            "linear-gradient(96deg, #0b1218 42%, rgba(11,18,24,0.82) 58%, rgba(11,18,24,0.18) 78%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          "flex-direction": "column",
          "align-items": "flex-start",
          padding: `0 ${PADDING}px`,
          "max-width": "820px",
        }}
      >
        <div
          style={{
            "font-size": `${titleSize(copy.title)}px`,
            "line-height": 0.98,
            "letter-spacing": "-0.02em",
          }}
        >
          {copy.title}
        </div>
        <div
          style={{
            "margin-top": "28px",
            "max-width": "640px",
            "font-family": "Martian Mono",
            "font-size": `${subtitleSize(copy.subtitle)}px`,
            "font-weight": 500,
            "letter-spacing": "0.05em",
            color: color.accent,
          }}
        >
          {copy.subtitle.toUpperCase()}
        </div>
        <Show when={copy.description}>
          {(description) => (
            <div
              style={{
                "margin-top": "24px",
                "max-width": "620px",
                "font-size": `${descriptionSize(description())}px`,
                "line-height": 1.4,
                color: color.inkMuted,
              }}
            >
              {description()}
            </div>
          )}
        </Show>
        <div
          style={{
            "margin-top": "34px",
            width: "180px",
            height: "10px",
            "border-radius": "5px",
            background: color.accent,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: `${PADDING}px`,
          top: `${OG_CARD_HEIGHT - 52 - 26}px`,
          "font-family": "Martian Mono",
          "font-size": "22px",
          "font-weight": 600,
          "letter-spacing": "0.06em",
          color: color.inkFaint,
        }}
      >
        {details.path}
      </div>
    </div>
  );
}

/** Plain card HTML is exported as a cheap semantic test seam. */
export function cardHtml(key: OgCardKey, language: Language): string {
  return markup(() => <OgCard cardKey={key} language={language} />);
}

export async function renderCard(key: OgCardKey, language: Language): Promise<Uint8Array> {
  const { node, css } = fromHtml(cardHtml(key, language));
  return (await getRenderer()).render(node, {
    width: OG_CARD_WIDTH,
    height: OG_CARD_HEIGHT,
    format: "png",
    css,
  });
}
