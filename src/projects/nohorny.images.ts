import canvas from "../assets/mindustry-canvas.webp";
import logicDisplay from "../assets/mindustry-logic-display.gif";
import canvasPreview from "../assets/previews/canvas.webp?inline";
import logicDisplayPreview from "../assets/previews/logic-display.webp?inline";
import type { ImageSource } from "../components/Image";

export const canvasImage = {
  src: canvas,
  preview: canvasPreview,
  width: 316,
  height: 387,
} satisfies ImageSource;

export const logicDisplayImage = {
  src: logicDisplay,
  preview: logicDisplayPreview,
  width: 400,
  height: 300,
} satisfies ImageSource;
