import type { Locale } from "../../lib/i18n";
import {
  appointmentRecords,
  customerRecords,
  type CustomerStage,
} from "../operations/placeholder-data";

const dashboardStages: CustomerStage[] = [
  "new_lead",
  "contacted",
  "booked",
  "active",
  "inactive",
];

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};

export type DashboardQueueItem = {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "success" | "warning";
};

export type DashboardStageItem = {
  stage: CustomerStage;
  label: string;
  count: number;
};

export type DashboardInsight = {
  id: string;
  customerName: string;
  summary: string;
  actionLabel: string;
};

export type DashboardDependency = {
  id: string;
  label: string;
  detail: string;
};

export type DashboardSnapshot = {
  metrics: DashboardMetric[];
  queue: DashboardQueueItem[];
  stages: DashboardStageItem[];
  insights: DashboardInsight[];
  dependencies: DashboardDependency[];
};

const stageLabels: Record<Locale, Record<CustomerStage, string>> = {
  en: {
    new_lead: "New leads",
    contacted: "Contacted",
    booked: "Booked",
    active: "Active",
    inactive: "Inactive",
  },
  zh: {
    new_lead: "新线索",
    contacted: "已联系",
    booked: "已预约",
    active: "活跃客户",
    inactive: "沉默客户",
  },
};

const copy = {
  en: {
    leadsHelper: "Customers waiting on a first or second manual touch.",
    appointmentsHelper: "Upcoming bookings across the next 72 hours.",
    remindersHelper: "Reminder drafts ready for operator approval.",
    followUpsHelper: "Accounts with a recommended next step today.",
  },
  zh: {
    leadsHelper: "等待首次或二次人工跟进的客户。",
    appointmentsHelper: "未来 72 小时内的预约数量。",
    remindersHelper: "已经准备好、等待人工确认的提醒。",
    followUpsHelper: "今天建议继续推进的客户数。",
  },
};

export async function getDashboardSnapshot(
  locale: Locale,
): Promise<DashboardSnapshot> {
  // API integration point: replace these synchronous placeholder records with
  // a workspace dashboard read model once the web app can call CRM endpoints.
  const openLeadCount = customerRecords.filter((customer) =>
    ["new_lead", "contacted"].includes(customer.stage),
  ).length;
  const upcomingAppointments = appointmentRecords.filter(
    (appointment) => appointment.status !== "completed",
  ).length;
  const reminderReadyCount = appointmentRecords.filter(
    (appointment) => appointment.reminderReady,
  ).length;
  const followUpCount = customerRecords.filter((customer) =>
    ["new_lead", "contacted", "booked"].includes(customer.stage),
  ).length;

  return {
    metrics: [
      {
        label: locale === "zh" ? "待推进线索" : "Pipeline leads",
        value: String(openLeadCount),
        helper: copy[locale].leadsHelper,
      },
      {
        label: locale === "zh" ? "近期预约" : "Upcoming appointments",
        value: String(upcomingAppointments),
        helper: copy[locale].appointmentsHelper,
      },
      {
        label: locale === "zh" ? "待审提醒" : "Reminders to review",
        value: String(reminderReadyCount),
        helper: copy[locale].remindersHelper,
      },
      {
        label: locale === "zh" ? "人工跟进" : "Manual follow-ups",
        value: String(followUpCount),
        helper: copy[locale].followUpsHelper,
      },
    ],
    queue: [
      {
        id: "queue-li-wei",
        title: locale === "zh" ? "Li Wei 14:00 到店" : "Li Wei arrives at 2:00 PM",
        detail:
          locale === "zh"
            ? "提醒文案已经就绪，只差人工确认发送。"
            : "Reminder copy is ready and only needs a manual send decision.",
        tone: "success",
      },
      {
        id: "queue-emma",
        title:
          locale === "zh"
            ? "Emma Chen 等待周末档期答复"
            : "Emma Chen is waiting on weekend options",
        detail:
          locale === "zh"
            ? "建议回复两个可选时段，并说明停车信息。"
            : "Reply with two candidate slots and a quick parking note.",
        tone: "warning",
      },
      {
        id: "queue-olivia",
        title:
          locale === "zh"
            ? "Olivia Johnson 可推进套餐升级"
            : "Olivia Johnson is ready for package follow-up",
        detail:
          locale === "zh"
            ? "昨天服务已完成，今天适合发送升级方案。"
            : "Yesterday's completed visit created a natural upsell moment today.",
        tone: "info",
      },
    ],
    stages: dashboardStages.map((stage) => ({
      stage,
      label: stageLabels[locale][stage],
      count: customerRecords.filter((customer) => customer.stage === stage).length,
    })),
    insights: customerRecords.slice(0, 3).map((customer) => ({
      id: customer.id,
      customerName: customer.name,
      summary: customer.summary,
      actionLabel: customer.recommendedAction,
    })),
    dependencies: [
      {
        id: "dep-customers",
        label: locale === "zh" ? "客户列表接口" : "Customer list endpoint",
        detail:
          locale === "zh"
            ? "这里会接入 workspace-aware CRM read model，替换当前静态客户快照。"
            : "Swap in the workspace-aware CRM read model for real customer counts.",
      },
      {
        id: "dep-appointments",
        label: locale === "zh" ? "预约读模型" : "Appointments read model",
        detail:
          locale === "zh"
            ? "用于提供今日队列、提醒状态和预约明细。"
            : "Needed for today's queue, reminder state, and schedule detail.",
      },
      {
        id: "dep-ai",
        label: locale === "zh" ? "AI 建议服务" : "AI suggestion service",
        detail:
          locale === "zh"
            ? "后续用真实摘要和 next-best-action 替换占位建议。"
            : "Placeholder suggestions can be replaced with live summaries later.",
      },
    ],
  };
}
