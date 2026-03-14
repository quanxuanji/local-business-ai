import type { Locale } from "../../lib/i18n";

const intlLocaleByAppLocale: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

export function formatDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(intlLocaleByAppLocale[locale], {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(intlLocaleByAppLocale[locale], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTime(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(intlLocaleByAppLocale[locale], {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
