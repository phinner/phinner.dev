import type { Component } from "solid-js";
import { cx } from "./cx";

export type IconName =
  | "arrow-up-right"
  | "docker"
  | "drizzle"
  | "github"
  | "gradle"
  | "java"
  | "kotlin"
  | "linkedin"
  | "location"
  | "mail"
  | "python"
  | "reactrouter"
  | "springboot"
  | "typescript";

const Icon: Component<{ name: IconName; class?: string }> = (props) => (
  <svg class={cx("shrink-0 fill-current", props.class)} aria-hidden="true">
    <use href={`/icons/${props.name}.svg#icon`} />
  </svg>
);

export default Icon;
