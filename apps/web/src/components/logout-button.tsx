"use client";

import type { Locale } from "../lib/i18n";

type LogoutButtonProps = {
  locale: Locale;
  action: () => Promise<never>;
};

export function LogoutButton({ locale, action }: LogoutButtonProps) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate hover:bg-stone-200 hover:text-ink"
      >
        {locale === "zh" ? "退出" : "Sign out"}
      </button>
    </form>
  );
}
