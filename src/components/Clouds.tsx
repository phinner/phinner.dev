import { For } from "solid-js";
import styles from "./Clouds.module.css";

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(seed: number) {
  return () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 2026;
const CLOUD_COUNT = 14;

const MIN_PUFF_COUNT = 3;
const MAX_PUFF_COUNT = 5;
const PUFF_RADIUS = 20;
const CENTER_RADIUS_BOOST = 12;
const RADIUS_VARIATION = 6;
const PUFF_SPACING = 0.55;

const CLOUD_HEIGHT = 76;
const BASE_HEIGHT = 24;
const OUTLINE_WIDTH = 6;

const FAR_WIDTH_REM = 18 * 0.55;
const NEAR_WIDTH_REM = 18 * 1.4;
const SIZE_VARIATION = 0.15;

const FAR_DURATION_SECONDS = 140;
const NEAR_DURATION_SECONDS = 55;
const ANIMATION_SPEED = 0.4;

const VERTICAL_SLOT_MARGIN = 0.15;
const HORIZONTAL_SLOT_MARGIN = 0.1;
const NEAR_DEPTH_THRESHOLD = 0.55;
const FLIP_PROBABILITY = 0.5;

const clouds = (() => {
  const random = mulberry32(SEED);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const slots = Array.from({ length: CLOUD_COUNT }, (_, i) => i);

  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  return slots.map((slot, i) => {
    const count = MIN_PUFF_COUNT + Math.floor(random() * (MAX_PUFF_COUNT - MIN_PUFF_COUNT + 1));
    let x = 0;
    let previousRadius = 0;
    const puffs = Array.from({ length: count }, (_, n) => {
      const middle = 1 - Math.abs(n / (count - 1) - 0.5) * 2;
      const r = PUFF_RADIUS + middle * CENTER_RADIUS_BOOST + random() * RADIUS_VARIATION;
      x += n === 0 ? r : (previousRadius + r) * PUFF_SPACING;
      previousRadius = r;
      return { x, r };
    });
    const width = Math.ceil(x + previousRadius);
    const depth = random();
    const size =
      lerp(FAR_WIDTH_REM, NEAR_WIDTH_REM, depth) *
      lerp(1 - SIZE_VARIATION, 1 + SIZE_VARIATION, random());
    const duration = lerp(FAR_DURATION_SECONDS, NEAR_DURATION_SECONDS, depth) / ANIMATION_SPEED;
    const top =
      ((i + VERTICAL_SLOT_MARGIN + random() * (1 - 2 * VERTICAL_SLOT_MARGIN)) / slots.length) * 100;
    const position =
      (slot + HORIZONTAL_SLOT_MARGIN + random() * (1 - 2 * HORIZONTAL_SLOT_MARGIN)) / slots.length;
    return {
      id: `cloud${i}`,
      puffs,
      width,
      near: depth > NEAR_DEPTH_THRESHOLD,
      flip: random() < FLIP_PROBABILITY,
      style: `--w:${size.toFixed(1)}rem;--ar:${(width / CLOUD_HEIGHT).toFixed(3)};--t:${duration.toFixed(0)}s;--delay:${(-position * duration).toFixed(1)}s;--pos:${position.toFixed(3)};top:${top.toFixed(1)}%`,
    };
  });
})();

export function Clouds() {
  return (
    <div class={styles.sky} aria-hidden="true">
      <For each={clouds}>
        {(cloud) => (
          <div
            class={{ [styles.cloud]: true, [styles.near]: cloud.near, [styles.flip]: cloud.flip }}
            style={cloud.style}
          >
            <svg aria-hidden="true" viewBox={`0 0 ${cloud.width} ${CLOUD_HEIGHT}`}>
              <defs>
                <g id={`${cloud.id}-s`}>
                  <For each={cloud.puffs}>
                    {(puff) => (
                      <circle
                        cx={puff.x.toFixed(1)}
                        cy={(CLOUD_HEIGHT - puff.r).toFixed(1)}
                        r={puff.r.toFixed(1)}
                      />
                    )}
                  </For>
                  <rect
                    x={cloud.puffs[0].x.toFixed(1)}
                    y={CLOUD_HEIGHT - BASE_HEIGHT}
                    width={(cloud.puffs[cloud.puffs.length - 1].x - cloud.puffs[0].x).toFixed(1)}
                    height={BASE_HEIGHT}
                  />
                </g>
                <mask
                  id={`${cloud.id}-m`}
                  maskUnits="userSpaceOnUse"
                  x={-OUTLINE_WIDTH}
                  y={-OUTLINE_WIDTH}
                  width={cloud.width + 2 * OUTLINE_WIDTH}
                  height={CLOUD_HEIGHT + 2 * OUTLINE_WIDTH}
                >
                  <rect
                    x={-OUTLINE_WIDTH}
                    y={-OUTLINE_WIDTH}
                    width={cloud.width + 2 * OUTLINE_WIDTH}
                    height={CLOUD_HEIGHT + 2 * OUTLINE_WIDTH}
                    fill="#fff"
                  />
                  <use href={`#${cloud.id}-s`} fill="#000" />
                </mask>
              </defs>
              <use
                href={`#${cloud.id}-s`}
                class={styles.outline}
                mask={`url(#${cloud.id}-m)`}
                stroke-width={OUTLINE_WIDTH}
              />
              <use href={`#${cloud.id}-s`} class={styles.body} />
            </svg>
          </div>
        )}
      </For>
    </div>
  );
}
