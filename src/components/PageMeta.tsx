import { Link, Meta, Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import { useLanguage } from "./LanguageProvider";

export function PageMeta(props: { title: string; description: string }) {
  const location = useLocation();
  const { language } = useLanguage();

  return (
    <>
      <Title>{props.title === "Phinner" ? "Phinner" : `${props.title} | Phinner`}</Title>
      <Meta name="description" content={props.description} />
      <Link rel="canonical" href={`https://phinner.dev${location.pathname}`} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={`https://phinner.dev${location.pathname}`} />
      <Meta property="og:locale" content={language() === "fr" ? "fr_BE" : "en_US"} />
    </>
  );
}
