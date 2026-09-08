import { useLocation } from "@solidjs/router";
import { isServer } from "@solidjs/web";
import { createEffect, onCleanup } from "solid-js";

export function NavigationTransitions() {
  const location = useLocation();
  let initial = true;
  let animation: Animation | undefined;

  createEffect(
    () => location.pathname,
    () => {
      if (isServer) return;
      if (initial) {
        initial = false;
        return;
      }
      animation?.cancel();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      animation = document.querySelector("main")?.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 160, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    },
  );

  onCleanup(() => animation?.cancel());
  return null;
}
