import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { getDashboardSnapshot } from "../../../features/dashboard/data";
import { DashboardWidgets } from "../../../features/dashboard/dashboard-widgets";
import { getLocaleFromValue } from "../../../lib/i18n";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) {
    notFound();
  }

  const snapshot = await getDashboardSnapshot(locale);

  return (
    <AppShell
      locale={locale}
      section="dashboard"
      title={locale === "zh" ? "运营总览" : "Operations dashboard"}
      description={
        locale === "zh"
          ? "先用安全占位数据搭建运营总览，后续直接替换为真实客户、预约和 AI 建议读模型。"
          : "The dashboard now uses placeholder-safe data flow and is ready to swap to real customer, booking, and AI read models."
      }
    >
      <DashboardWidgets locale={locale} snapshot={snapshot} />
    </AppShell>
  );
}
