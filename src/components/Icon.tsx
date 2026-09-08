import type { JSX } from "@solidjs/web";

const LUCIDE_SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  style: { fill: "none" },
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} satisfies JSX.SVGElementTags["svg"];

const SIMPLE_ICONS_SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
} satisfies JSX.SVGElementTags["svg"];

// Source: https://lucide.dev/icons/arrow-up
export function ArrowUpIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/arrow-up-right
export function ArrowUpRightIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/building-2
export function BuildingIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="M10 12h4" />
      <path d="M10 8h4" />
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/chevron-left
export function ChevronLeftIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/chevron-right
export function ChevronRightIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// Source: https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg
export function GitHubIcon() {
  return (
    <svg aria-hidden="true" {...SIMPLE_ICONS_SVG_PROPS}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/git-pull-request
export function GitPullRequestIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" x2="6" y1="9" y2="21" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/hammer
export function HammerIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </svg>
  );
}

// Source: https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/mail.svg
export function MailIcon() {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS}>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/moon
export function MoonIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

// Source: https://lucide.dev/icons/sun
export function SunIcon(props: { class?: string }) {
  return (
    <svg aria-hidden="true" {...LUCIDE_SVG_PROPS} class={props.class}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

// Source: https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/x.svg
export function XAkaTwitterIcon() {
  return (
    <svg aria-hidden="true" {...SIMPLE_ICONS_SVG_PROPS}>
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}

// Source: https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/discord.svg
export function DiscordIcon() {
  return (
    <svg aria-hidden="true" {...SIMPLE_ICONS_SVG_PROPS}>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}
