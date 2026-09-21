import { onSettled } from "solid-js";
import { type Content, useLanguage } from "./LanguageProvider";
import { LogoMark } from "./LogoMark";
import styles from "./MyLogo.module.css";

export function MyLogo() {
  const { language } = useLanguage();
  const content = {
    en: "Spin the logo",
    fr: "Faire tourner le logo",
  } satisfies Content;
  let logo: SVGSVGElement | undefined;
  onSettled(() => {
    const swirl = logo?.querySelector<SVGPathElement>(`.${styles.swirl}`);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (logo && swirl) {
      let angle = 0,
        velocity = 0,
        hovering = false,
        last = 0,
        frame = 0,
        settleAt = 0;
      const tick = (now: number) => {
        if (reduce.matches) {
          swirl.style.transform = "";
          frame = 0;
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        velocity += ((hovering ? 300 : 0) - velocity) * (1 - Math.exp(-dt * (hovering ? 5 : 1.5)));
        angle = (angle + velocity * dt) % 360;
        if (!hovering && Math.abs(velocity) < 2) {
          velocity = 0;
          if (!settleAt) settleAt = now + 600;
          if (now >= settleAt) {
            if (angle > 180) angle -= 360;
            angle -= angle * (1 - Math.exp(-dt * 1.8));
            if (Math.abs(angle) < 0.05) {
              angle = 0;
              settleAt = 0;
              swirl.style.transform = "";
              frame = 0;
              return;
            }
          }
        } else settleAt = 0;
        swirl.style.transform = `rotate(${angle}deg)`;
        frame = requestAnimationFrame(tick);
      };
      const start = () => {
        if (frame || reduce.matches) return;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      };
      logo.addEventListener("pointerenter", () => {
        hovering = true;
        start();
      });
      logo.addEventListener("pointerleave", () => {
        hovering = false;
      });
      const spin = () => {
        velocity += 540;
        start();
      };
      logo.addEventListener("click", spin);
      logo.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!event.repeat) spin();
        }
      });
      return () => cancelAnimationFrame(frame);
    }
  });

  return (
    <LogoMark
      class={styles.logo}
      innerClass={styles.inner}
      swirlClass={styles.swirl}
      role="button"
      tabindex={0}
      aria-label={content[language()]}
      ref={(element) => {
        logo = element;
      }}
    />
  );
}
