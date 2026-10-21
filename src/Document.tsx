import dmMonoLatin from "@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2?url";
import momoDisplayLatin from "@fontsource/momo-trust-display/files/momo-trust-display-latin-400-normal.woff2?url";
import momoSansLatin from "@fontsource-variable/momo-trust-sans/files/momo-trust-sans-latin-wght-normal.woff2?url";
import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";
import { ImageLoadingScript } from "./components/Image";
import { ThemeProviderScript } from "./components/ThemeProvider";
import { initialLanguage } from "./lib/language";

export default function Document(props: ParentProps) {
  return (
    <html lang={initialLanguage()} data-theme="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={momoDisplayLatin}
          crossorigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={momoSansLatin}
          crossorigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={dmMonoLatin}
          crossorigin="anonymous"
        />
        <ThemeProviderScript />
        <ImageLoadingScript />
        <HydrationScript />
      </head>
      <body id="top">{props.children}</body>
    </html>
  );
}
