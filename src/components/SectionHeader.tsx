import { Dynamic } from "@solidjs/web";
import type { Component, ParentProps } from "solid-js";
import shared from "../styles/shared.module.css";
import styles from "./SectionHeader.module.css";

export function SectionHeader(
  props: ParentProps<{
    title: string;
    icon: Component;
    heading?: "h1" | "h2";
  }>,
) {
  return (
    <header class={`${shared.panel} ${styles.sectionHead}`}>
      <span class={styles.n} aria-hidden="true">
        <Dynamic component={props.icon} />
      </span>
      <Dynamic component={props.heading ?? "h2"}>{props.title}</Dynamic>
      {props.children}
    </header>
  );
}
