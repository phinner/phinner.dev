import { Dynamic, Portal } from "@solidjs/web";
import { type Component, createSignal, onCleanup, type ParentProps, Show } from "solid-js";
import shared from "../styles/shared.module.css";
import styles from "./Contact.module.css";
import { DiscordIcon, GitHubIcon, MailIcon, XAkaTwitterIcon } from "./Icon";
import { type Content, useLanguage } from "./LanguageProvider";

const contacts = {
  github: {
    href: "https://github.com/phinner",
    icon: GitHubIcon,
    handle: "@phinner",
    name: "GitHub",
  },
  twitter: {
    href: "https://x.com/phinner9001",
    icon: XAkaTwitterIcon,
    handle: "@phinner9001",
    name: "X / Twitter",
  },
  mail: {
    href: "mailto:contact@phinner.dev",
    icon: MailIcon,
    handle: "contact@phinner.dev",
    name: { en: "Email", fr: "E-mail" },
  },
};

const discordHandle = "@phinner";
const copyContent = {
  en: {
    copy: "Copy Discord handle",
    copied: "Copied Discord handle",
    failed: "Couldn't copy Discord handle",
  },
  fr: {
    copy: "Copier le pseudo Discord",
    copied: "Pseudo Discord copié",
    failed: "Impossible de copier le pseudo Discord",
  },
} satisfies Content<{ copy: string; copied: string; failed: string }>;

function buttonClass(compact: boolean | undefined, accent = false) {
  return {
    [shared.btn]: true,
    [styles.contact]: !compact,
    [shared.square]: !!compact,
    [shared.accent]: accent,
  };
}

function Face(props: ParentProps<{ icon: Component; compact?: boolean }>) {
  return (
    <span class={`${shared.face} ${styles.face}`}>
      <Dynamic component={props.icon} />
      <Show when={!props.compact}>{props.children}</Show>
    </span>
  );
}

export function Contact(props: { name: keyof typeof contacts; compact?: boolean }) {
  const { language } = useLanguage();
  const contact = () => contacts[props.name];
  const name = () => {
    const label = contact().name;
    return typeof label === "string" ? label : label[language()];
  };
  return (
    <a
      href={contact().href}
      class={buttonClass(props.compact, props.name === "mail")}
      aria-label={`${name()}: ${contact().handle}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Face icon={contact().icon} compact={props.compact}>
        <span>{contact().handle}</span>
      </Face>
    </a>
  );
}

export function DiscordContact(props: { compact?: boolean }) {
  const { language } = useLanguage();
  const [status, setStatus] = createSignal<"idle" | "copied" | "failed">("idle");
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let attempt = 0;
  const message = () => {
    const current = status();
    return current === "idle" ? "" : copyContent[language()][current];
  };
  onCleanup(() => {
    attempt++;
    clearTimeout(timeout);
  });

  async function copyHandle() {
    const currentAttempt = ++attempt;
    clearTimeout(timeout);
    let result: "copied" | "failed";
    try {
      await navigator.clipboard.writeText(discordHandle);
      result = "copied";
    } catch {
      result = "failed";
    }
    if (currentAttempt !== attempt) return;
    setStatus(result);
    timeout = setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <>
      <button
        type="button"
        class={buttonClass(props.compact)}
        onClick={copyHandle}
        aria-label={`${copyContent[language()].copy}: ${discordHandle}`}
      >
        <Face icon={DiscordIcon} compact={props.compact}>
          <span aria-live="polite">{message() || discordHandle}</span>
        </Face>
      </button>
      <Show when={props.compact}>
        <Portal>
          <div
            class={styles.toast}
            data-visible={status() === "idle" ? "false" : "true"}
            role="status"
            aria-hidden={status() === "idle" ? "true" : "false"}
          >
            {message()}
          </div>
        </Portal>
      </Show>
    </>
  );
}
