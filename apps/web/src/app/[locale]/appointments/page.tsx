import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiErrorBanner } from "../../../components/api-error-banner";
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
          ? "查看和管理所有预约记录。"
          : "View and manage all appointment records."
      }
    >
      {snapshot.apiError && <ApiErrorBanner locale={locale} />}

      <div className="flex justify-end">
        <Link
          href={`/${locale}/appointments/new`}
          className="inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink/90"
        >
          {locale === "zh" ? "+ 新建预约" : "+ New appointment"}
        </Link>
      </div>

      <AppointmentsListView locale={locale} snapshot={snapshot} />
    </AppShell>
  );
}
