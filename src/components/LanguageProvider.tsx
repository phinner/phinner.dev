import { type JSX, serializeCookie } from "@solidjs/web";
import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  type ParentProps,
  useContext,
} from "solid-js";
import { initialLanguage, type Language } from "../lib/language";

export type Content<T = JSX.Element> = Record<Language, T>;

const LanguageContext = createContext<{
  language: Accessor<Language>;
  changeLanguage: (value: Language) => void;
}>();

export function LanguageProvider(props: ParentProps) {
  const [language, setLanguage] = createSignal(initialLanguage());
  createEffect(language, (value) => {
    document.documentElement.lang = value;
  });
  const changeLanguage = (value: Language) => {
    // biome-ignore lint/suspicious/noDocumentCookie: Keep language switching synchronous and available where Cookie Store is unsupported.
    document.cookie = serializeCookie("lang", value, {
      path: "/",
      sameSite: "lax",
      secure: location.protocol === "https:",
      maxAge: 60 * 60 * 24 * 365,
    });
    setLanguage(value);
  };

  return <LanguageContext value={{ language, changeLanguage }}>{props.children}</LanguageContext>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider is required");

  return value;
}
