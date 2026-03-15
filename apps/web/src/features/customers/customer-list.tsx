import Link from "next/link";

import { EmptyState } from "../../components/empty-state";
import { FeaturePanel } from "../../components/feature-panel";
import { MetricCard } from "../../components/metric-card";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import { formatDateTime } from "../operations/format";
import type { CustomerListSnapshot } from "./data";

type CustomersListViewProps = {
  locale: Locale;
  snapshot: CustomerListSnapshot;
};

const stageLabelByLocale = {
  en: {
    new_lead: "New lead",
    contacted: "Contacted",
    booked: "Booked",
    active: "Active",
    inactive: "Inactive",
  },
  zh: {
    new_lead: "新线索",
    contacted: "已联系",
    booked: "已预约",
    active: "活跃",
    inactive: "沉默",
  },
} as const;

function getStageTone(stage: keyof (typeof stageLabelByLocale)["en"]) {
  switch (stage) {
    case "new_lead":
      return "info";
    case "contacted":
      return "warning";
    case "booked":
    case "active":
      return "success";
    case "inactive":
      return "neutral";
    default:
      return "neutral";
  }
}

export function CustomersListView({
  locale,
  snapshot,
}: CustomersListViewProps) {
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
        title={locale === "zh" ? "客户列表" : "Customer roster"}
        description={
          locale === "zh"
            ? "这一版先用稳定的占位数据完成列表体验，等后端接口就绪后可以直接替换数据源。"
            : "This list is wired for placeholder-safe rendering now and can later swap to a real backend query."
        }
      >
        {snapshot.customers.length === 0 ? (
          <EmptyState
            icon="👥"
            title={locale === "zh" ? "暂无客户" : "No customers yet"}
            description={
              locale === "zh"
                ? "创建第一位客户，开始管理您的客户关系。"
                : "Create your first customer to start managing your client relationships."
            }
            action={{
              label: locale === "zh" ? "+ 新建客户" : "+ New customer",
              href: `/${locale}/customers/new`,
            }}
          />
        ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 bg-white text-left">
            <thead className="bg-mist/70 text-xs uppercase tracking-[0.18em] text-slate">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "客户" : "Customer"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "阶段" : "Stage"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "负责人" : "Owner"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "下一次预约" : "Next appointment"}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {locale === "zh" ? "最近动态" : "Last activity"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {snapshot.customers.map((customer) => {
                const appointmentParts = customer.nextAppointmentLabel.split(" | ");
                const formattedAppointment =
                  appointmentParts.length === 2
                    ? `${appointmentParts[0]} · ${formatDateTime(locale, appointmentParts[1] ?? "")}`
                    : customer.nextAppointmentLabel;

                return (
                  <tr key={customer.id} className="align-top">
                    <td className="px-4 py-4">
                      <Link
                        href={`/${locale}/customers/${customer.id}`}
                        className="text-sm font-semibold text-ink hover:text-pine"
                      >
                        {customer.name}
                      </Link>
                      <p className="mt-2 text-sm text-slate">{customer.source}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {customer.tags.map((tag) => (
                          <StatusBadge key={tag}>{tag}</StatusBadge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge tone={getStageTone(customer.stage)}>
                        {stageLabelByLocale[locale][customer.stage]}
                      </StatusBadge>
                      <p className="mt-3 text-sm text-slate">
                        {locale === "zh" ? "语言" : "Language"}:{" "}
                        {customer.preferredLanguage}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-ink">
                      {customer.ownerName}
                    </td>
                    <td className="px-4 py-4 text-sm leading-6 text-slate">
                      {formattedAppointment}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-ink">
                        {formatDateTime(locale, customer.lastActivityAt)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate">
                        {customer.lastMessage}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </FeaturePanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <FeaturePanel
          title={locale === "zh" ? "负责人负载" : "Owner coverage"}
          description={
            locale === "zh"
              ? "用最轻量的方式展示当前客户分配情况。"
              : "A lightweight snapshot of how customers are distributed across operators."
          }
        >
          <div className="space-y-3">
            {snapshot.ownerLoads.map((ownerLoad) => (
              <div
                key={ownerLoad.ownerName}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-medium text-ink">{ownerLoad.ownerName}</p>
                <p className="text-lg font-semibold text-ink">
                  {ownerLoad.customerCount}
                </p>
              </div>
            ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "后端依赖" : "Backend dependencies"}
          description={
            locale === "zh"
              ? "这些点位已经为后续 CRM 接口接入预留。"
              : "These are the clear seams for future CRM endpoint wiring."
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
