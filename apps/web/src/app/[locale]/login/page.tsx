import { notFound } from "next/navigation";

import { FeaturePanel } from "../../../components/feature-panel";
import { getDictionary, getLocaleFromValue } from "../../../lib/i18n";
import { LoginForm } from "./login-form";

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
            {locale === "zh"
              ? "输入工作空间 slug 和邮箱登录，开始管理客户运营。"
              : "Enter your workspace slug and email to sign in and start managing customer operations."}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky p-5">
              <p className="text-sm font-semibold text-ink">
                {locale === "zh" ? "测试账号" : "Test account"}
              </p>
              <p className="mt-2 text-sm text-slate">
                {locale === "zh"
                  ? "Slug: downtown-dental，邮箱: mia@example.com"
                  : "Slug: downtown-dental, Email: mia@example.com"}
              </p>
            </div>
            <div className="rounded-2xl bg-mist p-5">
              <p className="text-sm font-semibold text-ink">
                {locale === "zh" ? "AI 辅助模式" : "AI posture"}
              </p>
              <p className="mt-2 text-sm text-slate">
                {locale === "zh"
                  ? "仅提供建议，所有客户操作均需人工确认。"
                  : "Suggestions only. Human confirmation remains required before any customer-facing action."}
              </p>
            </div>
          </div>
        </section>

        <FeaturePanel
          title={locale === "zh" ? "运营人员登录" : "Operator sign-in"}
          description={
            locale === "zh"
              ? "输入 workspace slug 和邮箱即可登录。"
              : "Enter your workspace slug and email to get started."
          }
        >
          <LoginForm locale={locale} />
        </FeaturePanel>
      </div>
    </div>
  );
}
