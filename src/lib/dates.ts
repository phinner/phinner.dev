import type { Language } from "./language";

export const dateContent = {
  en: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    since: "Since",
    to: "to",
  },
  fr: {
    months: [
      "janv.",
      "févr.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sept.",
      "oct.",
      "nov.",
      "déc.",
    ],
    since: "Depuis",
    to: "à",
  },
} satisfies Record<Language, { months: string[]; since: string; to: string }>;

export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export type PartialDate = { year: number; month?: Month };

export type DateRange = { start: PartialDate; end: PartialDate | "now" };

export function formatDateRange(range: DateRange, language: Language): string {
  const content = dateContent[language];
  const format = (date: PartialDate) =>
    date.month === undefined ? `${date.year}` : `${content.months[date.month]} ${date.year}`;

  return range.end === "now"
    ? `${content.since} ${format(range.start)}`
    : `${format(range.start)} ${content.to} ${format(range.end)}`;
}
