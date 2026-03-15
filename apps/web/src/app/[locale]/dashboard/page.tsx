import Link from "next/link";
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

  const quickActions = [
    {
      href: `/${locale}/customers/new`,
      label: locale === "zh" ? "+ 新建客户" : "+ New customer",
    },
    {
      href: `/${locale}/appointments/new`,
      label: locale === "zh" ? "+ 新建预约" : "+ New appointment",
    },
    {
      href: `/${locale}/reviews`,
      label: locale === "zh" ? "评价管理" : "Reviews",
    },
  ];

  return (
    <AppShell
      locale={locale}
      section="dashboard"
      title={locale === "zh" ? "运营总览" : "Operations dashboard"}
      description={
        locale === "zh"
          ? "查看客户、预约、消息和评价数据概览。"
          : "Overview of customers, appointments, messaging and review metrics."
      }
    >
      <div className="flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-mist"
          >
            {a.label}
          </Link>
        ))}
      </div>

      <DashboardWidgets locale={locale} snapshot={snapshot} />
    </AppShell>
  );
}
