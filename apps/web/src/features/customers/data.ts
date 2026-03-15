import { apiFetch } from "../../lib/api-client";
import type {
  AppointmentResponse,
  CustomerListResponse,
  CustomerResponse,
} from "../../lib/api-types";
import type { Locale } from "../../lib/i18n";
import { getSession } from "../../lib/session";
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

export type PaginationInfo = {
  page: number;
  totalPages: number;
  total: number;
};

export type CustomerListSnapshot = {
  metrics: CustomerListMetric[];
  customers: CustomerListItem[];
  ownerLoads: OwnerLoad[];
  dependencies: string[];
  apiError?: boolean;
  pagination?: PaginationInfo;
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

const statusToStage: Record<string, CustomerStage> = {
  NEW_LEAD: "new_lead",
  CONTACTED: "contacted",
  BOOKED: "booked",
  ACTIVE: "active",
  INACTIVE: "inactive",
  LOST: "inactive",
};

const langLabel: Record<string, string> = {
  EN: "English",
  ZH: "Chinese",
};

const appointmentStatusMap: Record<string, "pending" | "confirmed" | "completed"> = {
  SCHEDULED: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELED: "completed",
  NO_SHOW: "completed",
};

const PAGE_SIZE = 20;

export async function getCustomersSnapshot(
  locale: Locale,
  page = 1,
): Promise<CustomerListSnapshot> {
  const session = await getSession();

  if (!session) {
    return getPlaceholderCustomersSnapshot(locale);
  }

  try {
    const response = await apiFetch<CustomerListResponse>(
      `/workspaces/${session.workspaceId}/customers`,
      { token: session.token, params: { limit: PAGE_SIZE, page } },
    );

    return transformCustomerList(locale, response);
  } catch {
    const placeholder = getPlaceholderCustomersSnapshot(locale);
    placeholder.apiError = true;
    return placeholder;
  }
}

function transformCustomerList(
  locale: Locale,
  response: CustomerListResponse,
): CustomerListSnapshot {
  const counts = response.summary.countsByStatus;

  const metrics: CustomerListMetric[] = [
    {
      label: locale === "zh" ? "客户总数" : "Customers tracked",
      value: String(response.summary.total),
      helper:
        locale === "zh"
          ? "包含新线索、已预约客户和沉默客户。"
          : "Includes leads, booked customers, and lapsed accounts.",
    },
    {
      label: locale === "zh" ? "需要跟进" : "Needs follow-up",
      value: String((counts["NEW_LEAD"] ?? 0) + (counts["CONTACTED"] ?? 0)),
      helper:
        locale === "zh"
          ? "建议今天继续推进的潜在客户。"
          : "Leads that still need an operator touch today.",
    },
    {
      label: locale === "zh" ? "已预约" : "Booked",
      value: String(counts["BOOKED"] ?? 0),
      helper:
        locale === "zh"
          ? "已经进入预约阶段、等待到店或完成。"
          : "Customers already moving through the booking flow.",
    },
    {
      label: locale === "zh" ? "活跃客户" : "Active clients",
      value: String(counts["ACTIVE"] ?? 0),
      helper:
        locale === "zh"
          ? "适合做复购和套餐升级的人群。"
          : "Best candidates for package follow-up and retention.",
    },
  ];

  const ownerMap = new Map<string, number>();
  for (const c of response.items) {
    const ownerName = c.owner?.name ?? (locale === "zh" ? "未分配" : "Unassigned");
    ownerMap.set(ownerName, (ownerMap.get(ownerName) ?? 0) + 1);
  }

  const customers: CustomerListItem[] = response.items.map((c) => ({
    id: c.id,
    name: c.fullName,
    stage: statusToStage[c.status] ?? "inactive",
    ownerName: c.owner?.name ?? (locale === "zh" ? "未分配" : "Unassigned"),
    preferredLanguage: langLabel[c.preferredLanguage] ?? c.preferredLanguage,
    source: c.source ?? "",
    nextAppointmentLabel:
      c.appointmentsCount > 0
        ? locale === "zh"
          ? `${c.appointmentsCount} 个预约`
          : `${c.appointmentsCount} appointment(s)`
        : locale === "zh"
          ? "暂无预约"
          : "No appointment scheduled",
    lastActivityAt: c.updatedAt,
    lastMessage: c.notes || "",
    tags: [c.status.replace("_", " ")],
  }));

  return {
    metrics,
    customers,
    ownerLoads: Array.from(ownerMap).map(([ownerName, customerCount]) => ({
      ownerName,
      customerCount,
    })),
    dependencies: [],
    pagination: {
      page: response.pagination.page,
      totalPages: response.pagination.pages,
      total: response.pagination.total,
    },
  };
}

export async function getCustomerDetail(
  customerId: string,
  locale: Locale,
): Promise<CustomerDetail | null> {
  const session = await getSession();

  if (!session) {
    return getPlaceholderCustomerDetail(customerId, locale);
  }

  try {
    const [customer, appointments] = await Promise.all([
      apiFetch<CustomerResponse>(
        `/workspaces/${session.workspaceId}/customers/${customerId}`,
        { token: session.token },
      ),
      apiFetch<AppointmentResponse[]>(
        `/workspaces/${session.workspaceId}/appointments`,
        { token: session.token, params: { customerId, limit: 20 } },
      ),
    ]);

    return transformCustomerDetail(locale, customer, appointments);
  } catch {
    return null;
  }
}

function transformCustomerDetail(
  locale: Locale,
  customer: CustomerResponse,
  appointments: AppointmentResponse[],
): CustomerDetail {
  const stage = statusToStage[customer.status] ?? "inactive";

  const profileItems = [
    {
      label: locale === "zh" ? "负责人" : "Owner",
      value: customer.owner?.name ?? (locale === "zh" ? "未分配" : "Unassigned"),
    },
    {
      label: locale === "zh" ? "偏好语言" : "Preferred language",
      value: langLabel[customer.preferredLanguage] ?? customer.preferredLanguage,
    },
    {
      label: locale === "zh" ? "来源" : "Source",
      value: customer.source ?? "-",
    },
    {
      label: locale === "zh" ? "电话" : "Phone",
      value: customer.phone ?? "-",
    },
    {
      label: locale === "zh" ? "邮箱" : "Email",
      value: customer.email ?? "-",
    },
    {
      label: locale === "zh" ? "状态" : "Status",
      value: customer.status.replace("_", " "),
    },
  ];

  const mappedAppointments: CustomerAppointmentItem[] = appointments.map((a) => ({
    id: a.id,
    service: a.serviceName ?? (locale === "zh" ? "未命名服务" : "Unnamed service"),
    startsAt: a.startsAt,
    status: appointmentStatusMap[a.status] ?? "pending",
    staffName: "-",
    note: a.notes ?? "",
  }));

  const timeline: CustomerTimelineItem[] = appointments.map((a) => ({
    id: `appt-${a.id}`,
    happenedAt: a.startsAt,
    title: a.serviceName ?? (locale === "zh" ? "预约" : "Appointment"),
    detail: `${a.status} · ${a.notes ?? ""}`.trim(),
    kind: "appointment" as const,
  }));

  return {
    id: customer.id,
    name: customer.fullName,
    stage,
    summary: customer.notes || (locale === "zh" ? "暂无备注。" : "No notes yet."),
    recommendedAction:
      locale === "zh"
        ? "后续由 AI 助手提供建议。"
        : "AI-assisted suggestions will appear here later.",
    tags: [customer.status.replace("_", " ")],
    profileItems,
    appointments: mappedAppointments,
    timeline: timeline.sort(
      (a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime(),
    ),
    dependencies: [],
  };
}

function getPlaceholderCustomersSnapshot(locale: Locale): CustomerListSnapshot {
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
        ? "当前显示占位数据。请登录以加载真实 CRM 数据。"
        : "Showing placeholder data. Sign in to load real CRM data.",
    ],
  };
}

function getPlaceholderCustomerDetail(
  customerId: string,
  locale: Locale,
): CustomerDetail | null {
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
        ? "当前显示占位数据。请登录以加载真实数据。"
        : "Showing placeholder data. Sign in to load real data.",
    ],
  };
}
