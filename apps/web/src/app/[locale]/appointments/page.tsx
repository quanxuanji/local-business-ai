import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { AppointmentsListView } from "../../../features/appointments/appointments-list";
import { getAppointmentsSnapshot } from "../../../features/appointments/data";
import { getLocaleFromValue } from "../../../lib/i18n";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) {
    notFound();
  }

  const snapshot = await getAppointmentsSnapshot(locale);

  return (
    <AppShell
      locale={locale}
      section="appointments"
      title={locale === "zh" ? "预约列表" : "Appointments"}
      description={
        locale === "zh"
          ? "当前页面聚焦预约队列、提醒准备情况和后端接入点，不对未完成的预订接口产生硬依赖。"
          : "This page focuses on queue visibility, reminder readiness, and clear backend seams without coupling to unfinished booking APIs."
      }
    >
      <AppointmentsListView locale={locale} snapshot={snapshot} />
    </AppShell>
  );
}
