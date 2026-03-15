import { apiFetch } from "../../lib/api-client";
import type {
  CustomerListResponse,
  DashboardSummaryResponse,
} from "../../lib/api-types";
import type { Locale } from "../../lib/i18n";
import { getSession } from "../../lib/session";
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
    todayHelper: "Appointments scheduled for today.",
    activeHelper: "Active clients suitable for retention and upsell.",
  },
  zh: {
    leadsHelper: "等待首次或二次人工跟进的客户。",
    appointmentsHelper: "未来的预约数量。",
    todayHelper: "今天安排的预约数量。",
    activeHelper: "适合做复购和套餐升级的活跃客户。",
  },
};

const statusToStage: Record<string, CustomerStage> = {
  NEW_LEAD: "new_lead",
  CONTACTED: "contacted",
  BOOKED: "booked",
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export async function getDashboardSnapshot(
  locale: Locale,
): Promise<DashboardSnapshot> {
  const session = await getSession();

  if (!session) {
    return getPlaceholderSnapshot(locale);
  }

  try {
    const [summary, customerList] = await Promise.all([
      apiFetch<DashboardSummaryResponse>(
        `/workspaces/${session.workspaceId}/dashboard/summary`,
        { token: session.token },
      ),
      apiFetch<CustomerListResponse>(
        `/workspaces/${session.workspaceId}/customers`,
        { token: session.token, params: { limit: 5 } },
      ),
    ]);

    return transformApiData(locale, summary, customerList);
  } catch {
    return getPlaceholderSnapshot(locale);
  }
}

function transformApiData(
  locale: Locale,
  summary: DashboardSummaryResponse,
  customerList: CustomerListResponse,
): DashboardSnapshot {
  const metrics: DashboardMetric[] = [
    {
      label: locale === "zh" ? "待推进线索" : "Pipeline leads",
      value: String(summary.customers.newLeads),
      helper: copy[locale].leadsHelper,
    },
    {
      label: locale === "zh" ? "近期预约" : "Upcoming appointments",
      value: String(summary.appointments.upcoming),
      helper: copy[locale].appointmentsHelper,
    },
    {
      label: locale === "zh" ? "今日预约" : "Today's appointments",
      value: String(summary.appointments.today),
      helper: copy[locale].todayHelper,
    },
    {
      label: locale === "zh" ? "活跃客户" : "Active clients",
      value: String(summary.customers.active),
      helper: copy[locale].activeHelper,
    },
    {
      label: locale === "zh" ? "已发消息" : "Messages sent",
      value: String(summary.messaging?.sent ?? 0),
      helper:
        locale === "zh"
          ? "已成功发送的 SMS/Email 消息数。"
          : "Total SMS/Email messages successfully sent.",
    },
    {
      label: locale === "zh" ? "待发消息" : "Message drafts",
      value: String(summary.messaging?.draft ?? 0),
      helper:
        locale === "zh"
          ? "等待人工确认后发送的消息草稿。"
          : "Drafts awaiting operator confirmation to send.",
    },
    {
      label: locale === "zh" ? "待处理评价" : "Pending reviews",
      value: String(summary.reviews?.requested ?? 0),
      helper:
        locale === "zh"
          ? "等待客户提交的评价请求。"
          : "Review requests awaiting customer submission.",
    },
    {
      label: locale === "zh" ? "平均评分" : "Average rating",
      value: summary.reviews?.averageRating != null ? String(summary.reviews.averageRating) : "-",
      helper:
        locale === "zh"
          ? "基于所有已评分的客户评价。"
          : "Based on all rated customer reviews.",
    },
  ];

  const queue: DashboardQueueItem[] = [];
  if (summary.nextAppointment) {
    queue.push({
      id: summary.nextAppointment.id,
      title:
        locale === "zh"
          ? `${summary.nextAppointment.customerName} 即将到店`
          : `${summary.nextAppointment.customerName} upcoming visit`,
      detail:
        summary.nextAppointment.serviceName
          ? `${summary.nextAppointment.serviceName} · ${new Date(summary.nextAppointment.startsAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}`
          : new Date(summary.nextAppointment.startsAt).toLocaleString(
              locale === "zh" ? "zh-CN" : "en-US",
            ),
      tone: "success",
    });
  }

  const counts = customerList.summary.countsByStatus;
  const stages: DashboardStageItem[] = dashboardStages.map((stage) => {
    const apiKey = Object.entries(statusToStage).find(
      ([, v]) => v === stage,
    )?.[0];
    return {
      stage,
      label: stageLabels[locale][stage],
      count: apiKey ? (counts[apiKey] ?? 0) : 0,
    };
  });

  const insights: DashboardInsight[] = customerList.items.slice(0, 3).map(
    (c) => ({
      id: c.id,
      customerName: c.fullName,
      summary: c.notes || (locale === "zh" ? "暂无备注" : "No notes yet"),
      actionLabel: c.owner
        ? locale === "zh"
          ? `负责人: ${c.owner.name}`
          : `Owner: ${c.owner.name}`
        : locale === "zh"
          ? "未分配负责人"
          : "No owner assigned",
    }),
  );

  return {
    metrics,
    queue,
    stages,
    insights,
    dependencies: [],
  };
}

function getPlaceholderSnapshot(locale: Locale): DashboardSnapshot {
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
        label: locale === "zh" ? "今日预约" : "Today's appointments",
        value: String(reminderReadyCount),
        helper: copy[locale].todayHelper,
      },
      {
        label: locale === "zh" ? "活跃客户" : "Active clients",
        value: String(followUpCount),
        helper: copy[locale].activeHelper,
      },
    ],
    queue: [
      {
        id: "queue-placeholder",
        title:
          locale === "zh"
            ? "占位数据 — 请登录查看真实数据"
            : "Placeholder — sign in to see real data",
        detail:
          locale === "zh"
            ? "登录后此处将展示来自后端的真实运营队列。"
            : "Once signed in, this panel shows live operational data from the backend.",
        tone: "info",
      },
    ],
    stages: dashboardStages.map((stage) => ({
      stage,
      label: stageLabels[locale][stage],
      count: customerRecords.filter((customer) => customer.stage === stage)
        .length,
    })),
    insights: customerRecords.slice(0, 3).map((customer) => ({
      id: customer.id,
      customerName: customer.name,
      summary: customer.summary,
      actionLabel: customer.recommendedAction,
    })),
    dependencies: [
      {
        id: "dep-login",
        label: locale === "zh" ? "需要登录" : "Sign in required",
        detail:
          locale === "zh"
            ? "当前显示占位数据。请先登录以加载真实的工作空间数据。"
            : "Showing placeholder data. Sign in to load real workspace data.",
      },
    ],
  };
}
