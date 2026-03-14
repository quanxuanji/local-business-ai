import Link from "next/link";

import { FeaturePanel } from "../../components/feature-panel";
import { MetricCard } from "../../components/metric-card";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import { formatDateTime } from "../operations/format";
import type { AppointmentsSnapshot } from "./data";

type AppointmentsListViewProps = {
  locale: Locale;
  snapshot: AppointmentsSnapshot;
};

export function AppointmentsListView({
  locale,
  snapshot,
}: AppointmentsListViewProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </div>

      <FeaturePanel
        title={locale === "zh" ? "预约队列" : "Appointment queue"}
        description={
          locale === "zh"
            ? "保持界面接近真实运营列表，但避免对未完成的后端接口产生硬依赖。"
            : "The screen stays production-like without introducing hard coupling to unfinished APIs."
        }
      >
        <div className="overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 bg-white text-left">
            <thead className="bg-mist/70 text-xs uppercase tracking-[0.18em] text-slate">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "客户" : "Customer"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "服务" : "Service"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "时间" : "Time"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "状态" : "Status"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "提醒" : "Reminder"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {snapshot.appointments.map((appointment) => (
                <tr key={appointment.id} className="align-top">
                  <td className="px-4 py-4">
                    <Link
                      href={`/${locale}/customers/${appointment.customerId}`}
                      className="text-sm font-semibold text-ink hover:text-pine"
                    >
                      {appointment.customerName}
                    </Link>
                    <p className="mt-2 text-sm text-slate">{appointment.channel}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-ink">
                      {appointment.service}
                    </p>
                    <p className="mt-2 text-sm text-slate">
                      {locale === "zh" ? "员工" : "Staff"}: {appointment.staffName}
                    </p>
                    <p className="mt-1 text-sm text-slate">{appointment.location}</p>
                  </td>
                  <td className="px-4 py-4 text-sm leading-6 text-slate">
                    {formatDateTime(locale, appointment.startsAt)}
                    <p className="mt-2">
                      {appointment.durationMinutes}
                      {locale === "zh" ? " 分钟" : " min"}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      tone={
                        appointment.status === "completed"
                          ? "success"
                          : appointment.status === "confirmed"
                            ? "info"
                            : "warning"
                      }
                    >
                      {appointment.status}
                    </StatusBadge>
                    <p className="mt-3 text-sm leading-6 text-slate">
                      {appointment.note}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      tone={appointment.reminderReady ? "success" : "neutral"}
                    >
                      {appointment.reminderReady
                        ? locale === "zh"
                          ? "可审核"
                          : "Ready to review"
                        : locale === "zh"
                          ? "等待中"
                          : "Waiting"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeaturePanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <FeaturePanel
          title={locale === "zh" ? "提醒准备情况" : "Reminder readiness"}
          description={
            locale === "zh"
              ? "不直接发送提醒，只展示当前哪些预约已经具备审核条件。"
              : "No reminders are sent from here yet; this only shows readiness for review."
          }
        >
          <div className="space-y-4">
            {snapshot.appointments
              .filter((appointment) => appointment.status !== "completed")
              .map((appointment) => (
                <article
                  key={`${appointment.id}-reminder`}
                  className="rounded-xl border border-stone-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-ink">
                      {appointment.customerName}
                    </h3>
                    <StatusBadge
                      tone={appointment.reminderReady ? "success" : "warning"}
                    >
                      {appointment.reminderReady
                        ? locale === "zh"
                          ? "已就绪"
                          : "Ready"
                        : locale === "zh"
                          ? "待补充"
                          : "Needs context"}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate">
                    {appointment.service} · {formatDateTime(locale, appointment.startsAt)}
                  </p>
                </article>
              ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "后端依赖" : "Backend dependencies"}
          description={
            locale === "zh"
              ? "后续预约 API 接入时，优先替换这些占位数据来源。"
              : "These are the primary seams to replace once booking APIs are ready."
          }
        >
          <div className="space-y-4">
            {snapshot.dependencies.map((dependency) => (
              <article
                key={dependency}
                className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm leading-6 text-slate"
              >
                {dependency}
              </article>
            ))}
          </div>
        </FeaturePanel>
      </div>
    </>
  );
}
