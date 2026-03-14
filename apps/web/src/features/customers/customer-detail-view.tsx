import Link from "next/link";

import { DescriptionList } from "../../components/description-list";
import { FeaturePanel } from "../../components/feature-panel";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import { formatDateTime } from "../operations/format";
import type { CustomerDetail } from "./data";

type CustomerDetailViewProps = {
  locale: Locale;
  customer: CustomerDetail;
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

const eventLabelByLocale = {
  en: {
    message: "Message",
    appointment: "Appointment",
    review: "Review",
    task: "Task",
  },
  zh: {
    message: "消息",
    appointment: "预约",
    review: "评价",
    task: "任务",
  },
} as const;

export function CustomerDetailView({
  locale,
  customer,
}: CustomerDetailViewProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={getStageTone(customer.stage)}>
          {stageLabelByLocale[locale][customer.stage]}
        </StatusBadge>
        {customer.tags.map((tag) => (
          <StatusBadge key={tag}>{tag}</StatusBadge>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <FeaturePanel
          title={locale === "zh" ? "客户概览" : "Customer profile"}
          description={customer.summary}
        >
          <DescriptionList items={customer.profileItems} />
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "下一步建议" : "Recommended next step"}
          description={
            locale === "zh"
              ? "先保留人工决策入口，后续再接入 AI 真实建议。"
              : "This remains human-approved even after live AI recommendations are added."
          }
        >
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-ink">
              {customer.recommendedAction}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate">
              {locale === "zh"
                ? "当前页面只展示建议内容，不会触发任何自动发送或状态变更。"
                : "The page only surfaces guidance right now and does not trigger any automated action."}
            </p>
            <Link
              href={`/${locale}/customers`}
              className="mt-4 inline-flex rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              {locale === "zh" ? "返回客户列表" : "Back to customers"}
            </Link>
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "预约记录" : "Appointment history"}
          description={
            locale === "zh"
              ? "未来预约与历史服务记录汇总在同一个面板中。"
              : "Upcoming bookings and past visits live in one lightweight timeline-friendly panel."
          }
        >
          <div className="space-y-4">
            {customer.appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-semibold text-ink">
                    {appointment.service}
                  </h3>
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
                </div>
                <p className="mt-3 text-sm leading-6 text-slate">
                  {formatDateTime(locale, appointment.startsAt)} ·{" "}
                  {locale === "zh" ? "服务人" : "Staff"}: {appointment.staffName}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate">{appointment.note}</p>
              </article>
            ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "客户时间线" : "Customer timeline"}
          description={
            locale === "zh"
              ? "这里预留给真实聚合读模型，当前先用占位事件验证布局。"
              : "This panel is ready for the eventual aggregated read model and uses placeholder events for now."
          }
        >
          <div className="space-y-4">
            {customer.timeline.map((event) => (
              <article
                key={event.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-semibold text-ink">{event.title}</h3>
                  <StatusBadge tone="neutral">
                    {eventLabelByLocale[locale][event.kind]}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-sm font-medium text-ink">
                  {formatDateTime(locale, event.happenedAt)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate">{event.detail}</p>
              </article>
            ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "后端接入提示" : "Backend handoff notes"}
          description={
            locale === "zh"
              ? "这些提示能帮助下一阶段把占位数据替换成真实接口。"
              : "These notes mark exactly where the next backend integration work should land."
          }
        >
          <div className="space-y-4">
            {customer.dependencies.map((dependency) => (
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
