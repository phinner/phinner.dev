import { For } from "solid-js";
import { CLOUD_HEIGHT, CloudShape, createCloudShape, mulberry32 } from "./CloudShape";
import styles from "./Clouds.module.css";

const SEED = 2026;
const CLOUD_COUNT = 14;

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
    const cloud = createCloudShape(random, `cloud${i}`);
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
      ...cloud,
      near: depth > NEAR_DEPTH_THRESHOLD,
      flip: random() < FLIP_PROBABILITY,
      style: `--w:${size.toFixed(1)}rem;--ar:${(cloud.width / CLOUD_HEIGHT).toFixed(3)};--t:${duration.toFixed(0)}s;--delay:${(-position * duration).toFixed(1)}s;--pos:${position.toFixed(3)};top:${top.toFixed(1)}%`,
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
            <CloudShape cloud={cloud} outlineClass={styles.outline} bodyClass={styles.body} />
          </div>
        )}
      </For>
    </div>
  );
}
