import { For } from "solid-js";

const MIN_PUFF_COUNT = 3;
const MAX_PUFF_COUNT = 5;
const PUFF_RADIUS = 20;
const CENTER_RADIUS_BOOST = 12;
const RADIUS_VARIATION = 6;
const PUFF_SPACING = 0.55;

export const CLOUD_HEIGHT = 76;
const BASE_HEIGHT = 24;
export const CLOUD_OUTLINE_WIDTH = 6;

interface Puff {
  x: number;
  r: number;
}

export interface CloudShapeModel {
  id: string;
  puffs: readonly Puff[];
  width: number;
}

export function mulberry32(seed: number): () => number {
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generates one cloud's drawing geometry. Placement remains the caller's concern. */
export function createCloudShape(random: () => number, id: string): CloudShapeModel {
  const count = MIN_PUFF_COUNT + Math.floor(random() * (MAX_PUFF_COUNT - MIN_PUFF_COUNT + 1));
  let x = 0;
  let previousRadius = 0;
  const puffs = Array.from({ length: count }, (_, index) => {
    const middle = 1 - Math.abs(index / (count - 1) - 0.5) * 2;
    const r = PUFF_RADIUS + middle * CENTER_RADIUS_BOOST + random() * RADIUS_VARIATION;
    x += index === 0 ? r : (previousRadius + r) * PUFF_SPACING;
    previousRadius = r;
    return { x, r };
  });

  return { id, puffs, width: Math.ceil(x + previousRadius) };
}

export function CloudShape(props: {
  cloud: CloudShapeModel;
  bodyClass?: string;
  bodyFill?: string;
  flip?: boolean;
  outlineClass?: string;
  outlineStroke?: string;
  padded?: boolean;
}) {
  const padding = () => (props.padded ? CLOUD_OUTLINE_WIDTH : 0);
  const shapeId = () => `${props.cloud.id}-s`;
  const maskId = () => `${props.cloud.id}-m`;
  const transform = () =>
    props.flip ? `translate(${props.cloud.width} 0) scale(-1 1)` : undefined;
  const first = () => props.cloud.puffs[0];
  const last = () => props.cloud.puffs[props.cloud.puffs.length - 1];

  return (
    <svg
      aria-hidden="true"
      viewBox={`${-padding()} ${-padding()} ${props.cloud.width + padding() * 2} ${CLOUD_HEIGHT + padding() * 2}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <g id={shapeId()}>
          <For each={props.cloud.puffs}>
            {(puff) => (
              <circle
                cx={puff.x.toFixed(1)}
                cy={(CLOUD_HEIGHT - puff.r).toFixed(1)}
                r={puff.r.toFixed(1)}
              />
            )}
          </For>
          <rect
            x={first().x.toFixed(1)}
            y={CLOUD_HEIGHT - BASE_HEIGHT}
            width={(last().x - first().x).toFixed(1)}
            height={BASE_HEIGHT}
          />
        </g>
        <mask
          id={maskId()}
          maskUnits="userSpaceOnUse"
          x={-CLOUD_OUTLINE_WIDTH}
          y={-CLOUD_OUTLINE_WIDTH}
          width={props.cloud.width + 2 * CLOUD_OUTLINE_WIDTH}
          height={CLOUD_HEIGHT + 2 * CLOUD_OUTLINE_WIDTH}
        >
          <rect
            x={-CLOUD_OUTLINE_WIDTH}
            y={-CLOUD_OUTLINE_WIDTH}
            width={props.cloud.width + 2 * CLOUD_OUTLINE_WIDTH}
            height={CLOUD_HEIGHT + 2 * CLOUD_OUTLINE_WIDTH}
            fill="#fff"
          />
          <use href={`#${shapeId()}`} fill="#000" />
        </mask>
      </defs>
      <g transform={transform()}>
        <use
          href={`#${shapeId()}`}
          class={props.outlineClass}
          fill="none"
          stroke={props.outlineStroke}
          mask={`url(#${maskId()})`}
          stroke-width={CLOUD_OUTLINE_WIDTH}
        />
        <use href={`#${shapeId()}`} class={props.bodyClass} fill={props.bodyFill} />
      </g>
    </svg>
  );
}
