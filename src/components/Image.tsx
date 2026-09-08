import type { JSX } from "@solidjs/web";
import { createEffect, createSignal } from "solid-js";
import styles from "./Image.module.css";

export type ImageSource = {
  src: string;
  preview: string;
  width: number;
  height: number;
};

export function Image(props: {
  image: ImageSource;
  alt: string;
  loading?: JSX.ImgHTMLAttributes<HTMLImageElement>["loading"];
  fit?: "cover" | "contain";
  position?: string;
}) {
  let element: HTMLImageElement | undefined;
  const [settledSource, setSettledSource] = createSignal("");
  const settle = () => setSettledSource(props.image.src);

  createEffect(
    () => props.image.src,
    () => {
      if (element?.complete) settle();
    },
  );

  return (
    <img
      ref={element}
      class={styles.image}
      src={props.image.src}
      alt={props.alt}
      width={props.image.width}
      height={props.image.height}
      loading={props.loading}
      decoding="async"
      style={{
        "--aspect-ratio": props.image.width / props.image.height,
        "background-image":
          settledSource() === props.image.src ? "none" : `url("${props.image.preview}")`,
        "background-size": props.fit ?? "cover",
        "background-position": props.position ?? "center",
      }}
      onLoad={settle}
      onError={settle}
    />
  );
}
