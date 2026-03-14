import Link from "next/link";
import { notFound } from "next/navigation";

import { FeaturePanel } from "../../../components/feature-panel";
import { getDictionary, getLocaleFromValue } from "../../../lib/i18n";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white/90 p-8 shadow-panel backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine">
            {dictionary.appName}
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            {dictionary.loginTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate">
            {dictionary.loginDescription}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky p-5">
              <p className="text-sm font-semibold text-ink">Phase 1</p>
              <p className="mt-2 text-sm text-slate">
                Auth, workspace, and customer onboarding land first so operators
                can start from lead capture immediately.
              </p>
            </div>
            <div className="rounded-2xl bg-mist p-5">
              <p className="text-sm font-semibold text-ink">AI posture</p>
              <p className="mt-2 text-sm text-slate">
                Suggestions only. Human confirmation remains required before any
                customer-facing action.
              </p>
            </div>
          </div>
        </section>

        <FeaturePanel
          title="Authentication placeholder"
          description="This form is intentionally non-functional until the NestJS auth module and session handling are implemented."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate">
              Workspace email
            </div>
            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate">
              Password
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              Sign in later
            </button>
            <Link
              href={`/${locale}/dashboard`}
              className="block text-center text-sm font-medium text-pine"
            >
              Explore scaffolded dashboard
            </Link>
          </div>
        </FeaturePanel>
      </div>
    </div>
  );
}
