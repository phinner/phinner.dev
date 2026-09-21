import { Link, Meta, Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import { OG_CARD_HEIGHT, OG_CARD_WIDTH, ogCardKey, ogCardPath } from "../lib/og";
import { useLanguage } from "./LanguageProvider";

const ORIGIN = "https://phinner.dev";

export function PageMeta(props: { title: string; description: string }) {
  const location = useLocation();
  const { language } = useLanguage();
  const card = () => `${ORIGIN}${ogCardPath(ogCardKey(location.pathname), language())}`;

  return (
    <>
      <Title>{props.title === "Phinner" ? "Phinner" : `${props.title} | Phinner`}</Title>
      <Meta name="description" content={props.description} />
      <Link rel="canonical" href={`${ORIGIN}${location.pathname}`} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={`${ORIGIN}${location.pathname}`} />
      <Meta property="og:locale" content={language() === "fr" ? "fr_BE" : "en_US"} />
      <Meta property="og:image" content={card()} />
      <Meta property="og:image:type" content="image/png" />
      <Meta property="og:image:width" content={String(OG_CARD_WIDTH)} />
      <Meta property="og:image:height" content={String(OG_CARD_HEIGHT)} />
      <Meta property="og:image:alt" content={`${props.title} — phinner.dev`} />
      <Meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
