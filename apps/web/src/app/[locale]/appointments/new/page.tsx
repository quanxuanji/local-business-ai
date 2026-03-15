import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../components/app-shell";
import { FeaturePanel } from "../../../../components/feature-panel";
import { apiFetch } from "../../../../lib/api-client";
import type { CustomerListResponse } from "../../../../lib/api-types";
import { getLocaleFromValue } from "../../../../lib/i18n";
import { getSession } from "../../../../lib/session";
import { createAppointmentAction } from "../../../../features/appointments/appointment-actions";
import { AppointmentForm } from "../../../../features/appointments/appointment-form";

export default async function NewAppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { locale: routeLocale } = await params;
  const { customerId } = await searchParams;
  const locale = getLocaleFromValue(routeLocale);
  if (!locale) notFound();

  const session = await getSession();
  if (!session) notFound();

  let customers: Array<{ id: string; name: string }> = [];
  try {
    const resp = await apiFetch<CustomerListResponse>(
      `/workspaces/${session.workspaceId}/customers`,
      { token: session.token },
    );
    const list = Array.isArray(resp) ? resp : resp.items ?? [];
    customers = list.map((c: { id: string; fullName?: string; firstName: string; lastName?: string | null }) => ({
      id: c.id,
      name: c.fullName ?? `${c.firstName} ${c.lastName ?? ""}`.trim(),
    }));
  } catch {
    /* empty customers - form still usable if user types ID */
  }

  const boundAction = createAppointmentAction.bind(null, locale);

  return (
    <AppShell
      locale={locale}
      section="appointments"
      title={locale === "zh" ? "新建预约" : "New appointment"}
      description={
        locale === "zh"
          ? "选择客户并设置预约时间。"
          : "Select a customer and set the appointment time."
      }
    >
      <FeaturePanel
        title={locale === "zh" ? "预约信息" : "Appointment details"}
        description={
          locale === "zh"
            ? "带 * 号的为必填字段。"
            : "Fields marked with * are required."
        }
      >
        <AppointmentForm
          locale={locale}
          action={boundAction}
          customers={customers}
          defaultCustomerId={customerId}
          submitLabel={locale === "zh" ? "创建预约" : "Create appointment"}
        />
      </FeaturePanel>

      <Link
        href={`/${locale}/appointments`}
        className="inline-flex rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-mist"
      >
        {locale === "zh" ? "返回预约列表" : "Back to appointments"}
      </Link>
    </AppShell>
  );
}
