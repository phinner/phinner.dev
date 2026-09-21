import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { LOGO_CLIP_PATH, LOGO_INNER_PATH, LOGO_RING_PATH, LOGO_SWIRL_PATH } from "./logo.paths";

type LogoMarkProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  clipId?: string;
  innerClass?: string;
  innerFill?: string;
  swirlClass?: string;
};

/** The static logo drawing, shared by the interactive site logo and image renderers. */
export function LogoMark(props: LogoMarkProps) {
  const svgProps = omit(props, "clipId", "innerClass", "innerFill", "swirlClass");
  const clipId = () => props.clipId ?? "swirl-clip";

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: Callers provide an aria label or use the mark decoratively.
    <svg {...svgProps} viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clipId()} clipPathUnits="userSpaceOnUse">
          <path d={LOGO_CLIP_PATH} />
        </clipPath>
      </defs>
      <path class={props.innerClass} fill={props.innerFill} d={LOGO_INNER_PATH} />
      <path fill="currentColor" fill-rule="evenodd" d={LOGO_RING_PATH} />
      <g clip-path={`url(#${clipId()})`}>
        <path class={props.swirlClass} fill="currentColor" d={LOGO_SWIRL_PATH} />
      </g>
    </svg>
  );
}
