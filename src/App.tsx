import { flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
  splitProps,
  type Component,
  type JSX,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { cx } from "./cx";
import { dict as enDict } from "./dict.en";
import { dict as frDict } from "./dict.fr";
import Icon, { type IconName } from "./Icon";

const NAME = String(import.meta.env["VITE_NAME"] || "[PLACEHOLDER]");
const EMAIL = String(import.meta.env["VITE_EMAIL"] || "[MAIL@PLACEHOLDER.COM]");
const LINKEDIN_URL = String(import.meta.env["VITE_LINKEDIN_URL"] || "");
const COPYRIGHT_YEAR = new Date().getFullYear();

const dictionaries = { en: enDict, fr: frDict };
type Locale = keyof typeof dictionaries;

const DEFAULT_LOCALE: Locale = "en";

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const requestedLocale = new URL(window.location.href).searchParams.get("lang");
  return requestedLocale === "en" || requestedLocale === "fr" ? requestedLocale : DEFAULT_LOCALE;
};

const syncUrlLocale = (locale: Locale) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", locale);
  window.history.replaceState(window.history.state, "", url);
};

const fillOnHover = "transition-colors hover:border-amber hover:bg-amber hover:text-amber-ink";

const bodyCopy = "mb-3 max-w-prose text-muted last:mb-0";
const noteCopy = "mb-3 max-w-prose text-sm text-text last:mb-0";

type SlabProps = JSX.HTMLAttributes<HTMLElement> &
  Pick<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    as?: ValidComponent | Component;
    accent?: boolean;
    variant?: "panel" | "title";
  };

const Slab: Component<SlabProps> = (props) => {
  const [local, rest] = splitProps(props, ["as", "accent", "variant", "class", "children"]);

  return (
    <Dynamic
      component={local.as ?? "div"}
      class={cx(
        "border",
        local.variant === "title" ? "border-amber-dim bg-title-slab" : "border-line bg-slab",
        local.accent && "border-l-4 border-l-amber",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </Dynamic>
  );
};

type HeroProps = {
  name: string;
  role: string;
  action?: JSX.Element;
  children: JSX.Element;
};

const Hero: Component<HeroProps> = (props) => (
  <Slab as="header" accent class="px-4 pt-6 pb-5 sm:px-6 sm:pt-8 sm:pb-6">
    <div class="mb-4 flex flex-col items-start gap-3 sm:flex-row">
      <div class="min-w-0">
        <h1 class="mb-0.5 text-4xl leading-none font-extrabold uppercase sm:text-6xl">
          {props.name}
        </h1>
        <p class="font-display font-bold tracking-widest text-amber uppercase">{props.role}</p>
      </div>
      {props.action}
    </div>
    {props.children}
  </Slab>
);

const Links: Component<{ children: JSX.Element }> = (props) => (
  <ul class="flex flex-wrap gap-2">{props.children}</ul>
);

const localeChip = (active: boolean) =>
  active ? "text-amber group-hover:text-amber-ink" : "text-faint group-hover:text-amber-ink/45";

const LanguageSwitcher: Component<{
  locale: Locale;
  label: string;
  onToggle: () => void;
}> = (props) => (
  <button
    type="button"
    class={cx(
      "group inline-flex cursor-pointer items-center gap-2 border border-amber-dim bg-panel-2 px-3 py-2 font-mono text-xs tracking-wider uppercase sm:ml-auto",
      fillOnHover,
    )}
    aria-label={props.label}
    onClick={props.onToggle}
  >
    <span class={localeChip(props.locale === "en")} aria-hidden="true">
      EN
    </span>
    <span class="text-faint group-hover:text-amber-ink/45" aria-hidden="true">
      /
    </span>
    <span class={localeChip(props.locale === "fr")} aria-hidden="true">
      FR
    </span>
  </button>
);

const Link: Component<JSX.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const [local, rest] = splitProps(props, ["target", "rel", "children"]);

  return (
    <a target={local.target ?? "_blank"} rel={local.rel ?? "noopener noreferrer"} {...rest}>
      {local.children}
    </a>
  );
};

const IconLink: Component<{
  href: string;
  icon: IconName;
  target?: JSX.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  children: JSX.Element;
}> = (props) => (
  <li>
    <Link
      class={cx(
        "inline-flex items-center gap-2 border border-line bg-panel-2 px-5 py-3 font-mono text-sm text-text no-underline",
        fillOnHover,
      )}
      href={props.href}
      target={props.target}
    >
      <Icon name={props.icon} class="size-4" />
      {props.children}
    </Link>
  </li>
);

const EmailCopyButton: Component<{
  email: string;
  copyLabel: string;
  copiedLabel: string;
}> = (props) => {
  const [copied, setCopied] = createSignal(false);
  let resetTimer: number | undefined;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(props.email);
    } catch {
      return;
    }

    setCopied(true);
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => setCopied(false), 2000);
  };

  onCleanup(() => window.clearTimeout(resetTimer));

  return (
    <li>
      <button
        type="button"
        class={cx(
          "inline-flex cursor-pointer items-center gap-2 border border-line bg-panel-2 px-5 py-3 font-mono text-sm text-text",
          fillOnHover,
        )}
        aria-label={copied() ? props.copiedLabel : props.copyLabel}
        onClick={copyEmail}
      >
        <Icon name="mail" class="size-4" />
        <span aria-live="polite">{copied() ? props.copiedLabel : props.email}</span>
      </button>
    </li>
  );
};

const SectionTitle: Component<{ children: JSX.Element }> = (props) => (
  <Slab variant="title" class="px-4 py-3 sm:px-5 sm:py-4">
    <h2 class="flex items-center gap-4 text-2xl font-extrabold tracking-widest text-amber uppercase sm:text-3xl">
      {props.children}
      <span class="h-0.5 flex-1 bg-linear-to-r from-amber to-transparent" aria-hidden="true" />
    </h2>
  </Slab>
);

const Entry: Component<{
  title: string;
  badge: string;
  href?: string;
  children: JSX.Element;
}> = (props) => (
  <Slab as="section" class="p-4 sm:px-6 sm:py-5" aria-label={props.title}>
    <div class="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
      <h3 class="text-lg font-extrabold tracking-wider uppercase sm:text-xl">{props.title}</h3>

      <Dynamic
        component={props.href ? Link : "div"}
        class={cx(
          "inline-flex items-center gap-1.5 border border-amber-dim px-3 py-2 font-mono text-xs tracking-wider text-amber uppercase no-underline sm:ml-auto",
          props.href && fillOnHover,
        )}
        href={props.href}
      >
        {props.badge}
        <Show when={props.href}>
          <Icon name="arrow-up-right" class="size-3.5" />
        </Show>
      </Dynamic>
    </div>

    {props.children}
  </Slab>
);

const Marks: Component<{ children: JSX.Element }> = (props) => (
  <ul class="mb-4 grid gap-2">{props.children}</ul>
);

const Mark: Component<{ children: JSX.Element }> = (props) => (
  <li class="flex max-w-prose gap-3 text-muted">
    <span
      class="mt-2.5 size-2 shrink-0 rotate-45 border-2 border-amber-dim bg-panel"
      aria-hidden="true"
    />
    <span>{props.children}</span>
  </li>
);

const PullRequest: Component<{ href: string; children: JSX.Element }> = (props) => (
  <Link class="font-mono text-amber no-underline" href={props.href}>
    {props.children}
  </Link>
);

const Stack: Component<{ children: JSX.Element }> = (props) => (
  <ul class="mt-4 flex flex-wrap gap-1.5">{props.children}</ul>
);

const TechTag: Component<{ icon?: IconName; children: JSX.Element }> = (props) => (
  <li class="inline-flex items-center gap-2 border border-line bg-panel-2 px-3 py-1.5 font-mono text-sm text-muted">
    <Show when={props.icon}>{(icon) => <Icon name={icon()} class="size-4 text-faint" />}</Show>
    {props.children}
  </li>
);

const Divider: Component = () => <div class="my-4 border-t border-line-soft" aria-hidden="true" />;

const App: Component = () => {
  const [locale, setLocale] = createSignal<Locale>(getInitialLocale());
  const dictionary = createMemo(() => flatten(dictionaries[locale()]));
  const t = translator(dictionary, resolveTemplate);

  createEffect(() => {
    const currentLocale = locale();
    document.documentElement.lang = currentLocale;
    syncUrlLocale(currentLocale);
  });

  const selectLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  return (
    <>
      <main
        id="main"
        tabIndex={-1}
        class="mx-auto mt-6 grid max-w-4xl gap-3 px-3 focus:outline-none sm:px-4"
      >
        <Hero
          name={NAME}
          role={t("hero.role")}
          action={
            <LanguageSwitcher
              locale={locale()}
              label={
                locale() === "en" ? t("language.switchToFrench") : t("language.switchToEnglish")
              }
              onToggle={() => selectLocale(locale() === "en" ? "fr" : "en")}
            />
          }
        >
          <p class={bodyCopy}>
            {"👋" /* Wave emoji */} {t("hero.introduction")} {"🇧🇪" /* BE flag emoji*/}.
          </p>
          <p class={bodyCopy}>{t("hero.specialty")}</p>

          <Links>
            <IconLink href="https://github.com/phinner" icon="github">
              GitHub
            </IconLink>
            <Show when={LINKEDIN_URL.length > 0}>
              <IconLink href={LINKEDIN_URL} icon="linkedin">
                LinkedIn
              </IconLink>
            </Show>
            <EmailCopyButton
              email={EMAIL}
              copyLabel={t("hero.copyEmail")}
              copiedLabel={t("hero.emailCopied")}
            />
          </Links>
        </Hero>

        <SectionTitle>{t("sections.experience")}</SectionTitle>

        <Entry title={t("experience.rteam.title")} badge={t("experience.rteam.period")}>
          <p class={bodyCopy}>{t("experience.rteam.description")}</p>

          <Marks>
            <Mark>
              {t("experience.rteam.website", <Link href="https://rteam.be">rteam.be</Link>)}
            </Mark>
            <Mark>
              {t(
                "experience.rteam.operations",
                <Link href="https://www.facebook.com/people/RTeam/61591963027194/">Facebook</Link>,
                <Link href="https://maps.app.goo.gl/HCq4Qd1x7YQPM8Ws5">Google</Link>,
              )}
            </Mark>
          </Marks>

          <Divider />

          <Stack>
            <TechTag icon="reactrouter">React Router 7</TechTag>
            <TechTag icon="typescript">TypeScript</TechTag>
            <TechTag icon="drizzle">Drizzle</TechTag>
            <TechTag>SQL</TechTag>
            <TechTag>SEO</TechTag>
            <TechTag>GEO</TechTag>
          </Stack>
        </Entry>

        <Entry title={t("experience.openSource.title")} badge={t("experience.openSource.period")}>
          <p class={bodyCopy}>
            {t(
              "experience.openSource.introduction",
              <Link href="https://github.com/Anuken/Mindustry">Mindustry</Link>,
            )}
          </p>

          <Marks>
            <Mark>
              {t(
                "experience.openSource.dependencyResolution",
                <PullRequest href="https://github.com/Anuken/Mindustry/pull/6328">
                  Mindustry#6328
                </PullRequest>,
                <PullRequest href="https://github.com/Anuken/Mindustry/pull/7972">
                  Mindustry#7972
                </PullRequest>,
              )}
            </Mark>
            <Mark>
              {t(
                "experience.openSource.srvRecords",
                <PullRequest href="https://github.com/Anuken/Mindustry/pull/6982">
                  Mindustry#6982
                </PullRequest>,
                <PullRequest href="https://github.com/Anuken/Arc/pull/116">Arc#116</PullRequest>,
              )}
            </Mark>
          </Marks>

          <p class={bodyCopy}>
            {t(
              "experience.openSource.xpdustry",
              <Link href="https://github.com/xpdustry">xpdustry</Link>,
            )}
          </p>
        </Entry>

        <SectionTitle>{t("sections.projects")}</SectionTitle>

        <Entry
          title="Nohorny"
          badge={t("projects.source")}
          href="https://github.com/xpdustry/nohorny"
        >
          <p class={bodyCopy}>{t("projects.nohorny.displayBlocks")}</p>
          <p class={bodyCopy}>{t("projects.nohorny.classification")}</p>
          <p class={noteCopy}>{t("projects.nohorny.usage")}</p>

          <Divider />

          <Stack>
            <TechTag icon="java">Java</TechTag>
            <TechTag icon="gradle">Gradle</TechTag>
            <TechTag icon="springboot">Spring Boot</TechTag>
            <TechTag icon="python">Python</TechTag>
            <TechTag icon="docker">Docker</TechTag>
          </Stack>
        </Entry>

        <Entry
          title="Imperium"
          badge={t("projects.source")}
          href="https://github.com/xpdustry/imperium"
        >
          <p class={bodyCopy}>{t("projects.imperium.description")}</p>

          <Marks>
            <Mark>{t("projects.imperium.moderation")}</Mark>
            <Mark>{t("projects.imperium.communication")}</Mark>
            <Mark>{t("projects.imperium.operations")}</Mark>
          </Marks>

          <Divider />

          <Stack>
            <TechTag icon="kotlin">Kotlin</TechTag>
            <TechTag icon="gradle">Gradle</TechTag>
            <TechTag>SQL</TechTag>
          </Stack>
        </Entry>

        <Entry
          title="Toxopid"
          badge={t("projects.source")}
          href="https://github.com/xpdustry/toxopid"
        >
          <p class={bodyCopy}>{t("projects.toxopid.description")}</p>
          <p class={noteCopy}>{t("projects.toxopid.usage")}</p>

          <Divider />

          <Stack>
            <TechTag icon="kotlin">Kotlin</TechTag>
            <TechTag icon="gradle">Gradle</TechTag>
          </Stack>
        </Entry>

        <Slab
          as={Link}
          class={cx(
            "group flex items-center gap-3 px-4 py-4 font-display text-sm font-bold tracking-widest text-text uppercase no-underline sm:px-6 sm:py-5 sm:text-base",
            fillOnHover,
          )}
          href="https://github.com/xpdustry"
        >
          <Icon name="github" class="size-5 text-amber group-hover:text-amber-ink" />
          <span>{t("projects.moreOnGitHub")}</span>
          <Icon
            name="arrow-up-right"
            class="ml-auto size-5 text-amber group-hover:text-amber-ink"
          />
        </Slab>
      </main>

      <div class="mx-auto mt-3 mb-6 flex max-w-4xl gap-3 px-3 sm:px-4">
        <Slab
          as="footer"
          class="flex min-h-11 min-w-0 flex-1 items-center justify-center px-4 text-center font-mono text-xs tracking-wider text-faint uppercase sm:px-6"
        >
          {t("footer.copyright", { year: COPYRIGHT_YEAR, name: NAME })}
        </Slab>

        <Link
          href="#main"
          target="_self"
          aria-label={t("footer.backToTop")}
          class={cx(
            "group flex size-11 items-center justify-center border border-line bg-slab text-amber no-underline",
            fillOnHover,
          )}
        >
          <Icon name="arrow-up-right" class="size-5 -rotate-45 group-hover:text-amber-ink" />
        </Link>
      </div>
    </>
  );
};

export default App;
