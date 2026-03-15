import Link from "next/link";
import type { ReactNode } from "react";

import { getDictionary, type Locale, type SectionKey } from "../lib/i18n";
import { getSession } from "../lib/session";
import { logoutAction } from "../app/[locale]/login/actions";
import { LogoutButton } from "./logout-button";

const navigationOrder: SectionKey[] = [
  "dashboard",
  "customers",
  "appointments",
  "calendar",
  "workflows",
  "reviews",
  "settings",
];

type AppShellProps = {
  locale: Locale;
  section: SectionKey;
  title: string;
  description: string;
  children: ReactNode;
};

export async function AppShell({
  locale,
  section,
  title,
  description,
  children,
}: AppShellProps) {
  const dictionary = getDictionary(locale);
  const session = await getSession();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row">
        <aside className="w-full rounded-2xl bg-white/85 p-6 shadow-panel backdrop-blur lg:w-72">
          <Link href={`/${locale}/dashboard`} className="block">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine">
              {dictionary.appName}
            </p>
            <h1 className="mt-3 text-2xl font-semibold">{dictionary.appTagline}</h1>
          </Link>

          {session && (
            <div className="mt-4 rounded-xl border border-stone-200 bg-mist/50 px-4 py-3">
              <p className="text-sm font-semibold text-ink">{session.userName}</p>
              <p className="mt-0.5 text-xs text-slate">{session.workspaceName}</p>
              <div className="mt-2">
                <LogoutButton locale={locale} action={logoutAction} />
              </div>
            </div>
          )}

          {!session && (
            <Link
              href={`/${locale}/login`}
              className="mt-4 block rounded-xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {locale === "zh" ? "登录" : "Sign in"}
            </Link>
          )}

          <nav className="mt-6 space-y-2">
            {navigationOrder.map((item) => {
              const isActive = item === section;

              return (
                <Link
                  key={item}
                  href={`/${locale}/${item}`}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-ink text-white"
                      : "bg-mist text-ink hover:bg-sky"
                  }`}
                >
                  {dictionary.sectionLabels[item]}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="rounded-[2rem] bg-white/90 px-8 py-8 shadow-panel backdrop-blur">
            <div className="border-b border-stone-200 pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine">
                {session ? session.workspaceName : "MVP scaffold"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">{title}</h2>
              <p className="mt-3 max-w-3xl text-base text-slate">{description}</p>
            </div>

            <div className="mt-8 space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
