import type { Locale } from "../../lib/i18n";
import {
  appointmentRecords,
  customerRecords,
  timelineEventRecords,
  type CustomerStage,
} from "../operations/placeholder-data";

export type CustomerListItem = {
  id: string;
  name: string;
  stage: CustomerStage;
  ownerName: string;
  preferredLanguage: string;
  source: string;
  nextAppointmentLabel: string;
  lastActivityAt: string;
  lastMessage: string;
  tags: string[];
};

export type CustomerListMetric = {
  label: string;
  value: string;
  helper: string;
};

export type OwnerLoad = {
  ownerName: string;
  customerCount: number;
};

export type CustomerListSnapshot = {
  metrics: CustomerListMetric[];
  customers: CustomerListItem[];
  ownerLoads: OwnerLoad[];
  dependencies: string[];
};

export type CustomerTimelineItem = {
  id: string;
  happenedAt: string;
  title: string;
  detail: string;
  kind: "message" | "appointment" | "review" | "task";
};

export type CustomerAppointmentItem = {
  id: string;
  service: string;
  startsAt: string;
  status: "pending" | "confirmed" | "completed";
  staffName: string;
  note: string;
};

export type CustomerDetail = {
  id: string;
  name: string;
  stage: CustomerStage;
  summary: string;
  recommendedAction: string;
  tags: string[];
  profileItems: Array<{ label: string; value: string }>;
  appointments: CustomerAppointmentItem[];
  timeline: CustomerTimelineItem[];
  dependencies: string[];
};

export async function getCustomersSnapshot(
  locale: Locale,
): Promise<CustomerListSnapshot> {
  // API integration point: swap this out for the customer list query once the
  // CRM read model and filtering endpoints are available from the backend.
  const ownerLoads = Array.from(
    customerRecords.reduce<Map<string, number>>((accumulator, customer) => {
      const currentCount = accumulator.get(customer.ownerName) ?? 0;
      accumulator.set(customer.ownerName, currentCount + 1);
      return accumulator;
    }, new Map()),
  ).map(([ownerName, customerCount]) => ({
    ownerName,
    customerCount,
  }));

  return {
    metrics: [
      {
        label: locale === "zh" ? "客户总数" : "Customers tracked",
        value: String(customerRecords.length),
        helper:
          locale === "zh"
            ? "包含新线索、已预约客户和沉默客户。"
            : "Includes leads, booked customers, and lapsed accounts.",
      },
      {
        label: locale === "zh" ? "需要跟进" : "Needs follow-up",
        value: String(
          customerRecords.filter((customer) =>
            ["new_lead", "contacted"].includes(customer.stage),
          ).length,
        ),
        helper:
          locale === "zh"
            ? "建议今天继续推进的潜在客户。"
            : "Leads that still need an operator touch today.",
      },
      {
        label: locale === "zh" ? "已预约" : "Booked",
        value: String(
          customerRecords.filter((customer) => customer.stage === "booked").length,
        ),
        helper:
          locale === "zh"
            ? "已经进入预约阶段、等待到店或完成。"
            : "Customers already moving through the booking flow.",
      },
      {
        label: locale === "zh" ? "活跃客户" : "Active clients",
        value: String(
          customerRecords.filter((customer) => customer.stage === "active").length,
        ),
        helper:
          locale === "zh"
            ? "适合做复购和套餐升级的人群。"
            : "Best candidates for package follow-up and retention.",
      },
    ],
    customers: customerRecords.map((customer) => {
      const nextAppointment = appointmentRecords
        .filter(
          (appointment) =>
            appointment.customerId === customer.id &&
            appointment.status !== "completed",
        )
        .sort((left, right) => left.startsAt.localeCompare(right.startsAt))[0];

      return {
        id: customer.id,
        name: customer.name,
        stage: customer.stage,
        ownerName: customer.ownerName,
        preferredLanguage: customer.preferredLanguage,
        source: customer.source,
        nextAppointmentLabel: nextAppointment
          ? `${nextAppointment.service} | ${nextAppointment.startsAt}`
          : locale === "zh"
            ? "暂无预约"
            : "No appointment scheduled",
        lastActivityAt: customer.lastActivityAt,
        lastMessage: customer.lastMessage,
        tags: customer.tags,
      };
    }),
    ownerLoads,
    dependencies: [
      locale === "zh"
        ? "客户列表最终需要真实筛选、分页和 workspace 隔离。"
        : "Customer list still needs real filters, pagination, and workspace isolation.",
      locale === "zh"
        ? "客户阶段、负责人和最近触达时间应来自 CRM 查询接口。"
        : "Lifecycle stage, owner, and recent touch data should come from CRM queries.",
    ],
  };
}

export async function getCustomerDetail(
  customerId: string,
  locale: Locale,
): Promise<CustomerDetail | null> {
  // API integration point: replace this lookup with the customer detail query
  // once the profile, appointment, and timeline read models are wired up.
  const customer = customerRecords.find((record) => record.id === customerId);

  if (!customer) {
    return null;
  }

  return {
    id: customer.id,
    name: customer.name,
    stage: customer.stage,
    summary: customer.summary,
    recommendedAction: customer.recommendedAction,
    tags: customer.tags,
    profileItems: [
      { label: locale === "zh" ? "负责人" : "Owner", value: customer.ownerName },
      {
        label: locale === "zh" ? "偏好语言" : "Preferred language",
        value: customer.preferredLanguage,
      },
      { label: locale === "zh" ? "来源" : "Source", value: customer.source },
      {
        label: locale === "zh" ? "区域" : "Neighborhood",
        value: customer.neighborhood,
      },
      { label: locale === "zh" ? "电话" : "Phone", value: customer.phone },
      { label: locale === "zh" ? "邮箱" : "Email", value: customer.email },
    ],
    appointments: appointmentRecords
      .filter((appointment) => appointment.customerId === customer.id)
      .sort((left, right) => right.startsAt.localeCompare(left.startsAt))
      .map((appointment) => ({
        id: appointment.id,
        service: appointment.service,
        startsAt: appointment.startsAt,
        status: appointment.status,
        staffName: appointment.staffName,
        note: appointment.note,
      })),
    timeline: timelineEventRecords
      .filter((event) => event.customerId === customer.id)
      .sort((left, right) => right.happenedAt.localeCompare(left.happenedAt)),
    dependencies: [
      locale === "zh"
        ? "客户详情后续应拼接真实消息、预约和评论时间线。"
        : "Customer detail should eventually compose real messaging, appointment, and review timeline data.",
      locale === "zh"
        ? "AI 摘要和下一步建议目前仍是安全占位内容。"
        : "AI summary and next-best action are still placeholder-safe until the service exists.",
    ],
  };
}
