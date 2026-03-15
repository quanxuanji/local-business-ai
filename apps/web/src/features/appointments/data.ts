import { apiFetch } from "../../lib/api-client";
import type { AppointmentResponse } from "../../lib/api-types";
import type { Locale } from "../../lib/i18n";
import { getSession } from "../../lib/session";
import {
  appointmentRecords,
  customerRecords,
  type AppointmentStatus,
} from "../operations/placeholder-data";

export type AppointmentListMetric = {
  label: string;
  value: string;
  helper: string;
};

export type AppointmentListItem = {
  id: string;
  customerId: string;
  customerName: string;
  service: string;
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  staffName: string;
  location: string;
  channel: string;
  reminderReady: boolean;
  note: string;
};

export type AppointmentsSnapshot = {
  metrics: AppointmentListMetric[];
  appointments: AppointmentListItem[];
  dependencies: string[];
};

const statusMap: Record<string, AppointmentStatus> = {
  SCHEDULED: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELED: "completed",
  NO_SHOW: "completed",
};

export async function getAppointmentsSnapshot(
  locale: Locale,
): Promise<AppointmentsSnapshot> {
  const session = await getSession();

  if (!session) {
    return getPlaceholderSnapshot(locale);
  }

  try {
    const appointments = await apiFetch<AppointmentResponse[]>(
      `/workspaces/${session.workspaceId}/appointments`,
      { token: session.token, params: { limit: 50 } },
    );

    return transformAppointments(locale, appointments);
  } catch {
    return getPlaceholderSnapshot(locale);
  }
}

function transformAppointments(
  locale: Locale,
  appointments: AppointmentResponse[],
): AppointmentsSnapshot {
  const items: AppointmentListItem[] = appointments.map((a) => {
    const startsAt = new Date(a.startsAt);
    const endsAt = a.endsAt ? new Date(a.endsAt) : null;
    const durationMinutes = endsAt
      ? Math.round((endsAt.getTime() - startsAt.getTime()) / 60000)
      : 60;

    return {
      id: a.id,
      customerId: a.customerId,
      customerName: a.customer.fullName,
      service:
        a.serviceName ?? (locale === "zh" ? "未命名服务" : "Unnamed service"),
      startsAt: a.startsAt,
      durationMinutes,
      status: statusMap[a.status] ?? "pending",
      staffName: "-",
      location: "-",
      channel: "-",
      reminderReady:
        a.status === "CONFIRMED" || a.status === "SCHEDULED",
      note: a.notes ?? "",
    };
  });

  const sorted = items.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = sorted.filter((a) =>
    a.startsAt.startsWith(today),
  ).length;
  const pendingCount = sorted.filter((a) => a.status === "pending").length;
  const reminderCount = sorted.filter((a) => a.reminderReady).length;
  const completedCount = sorted.filter((a) => a.status === "completed").length;

  return {
    metrics: [
      {
        label: locale === "zh" ? "今日预约" : "Today's bookings",
        value: String(todayCount),
        helper:
          locale === "zh"
            ? "今天安排的到店数量。"
            : "Visits scheduled for today.",
      },
      {
        label: locale === "zh" ? "待确认" : "Awaiting confirmation",
        value: String(pendingCount),
        helper:
          locale === "zh"
            ? "仍需要人工确认时间或客户回复。"
            : "Still needs a customer reply or an operator confirmation.",
      },
      {
        label: locale === "zh" ? "提醒就绪" : "Reminders ready",
        value: String(reminderCount),
        helper:
          locale === "zh"
            ? "可以进入提醒审核流程的预约。"
            : "Appointments that are ready for a manual reminder review.",
      },
      {
        label: locale === "zh" ? "已完成" : "Completed",
        value: String(completedCount),
        helper:
          locale === "zh"
            ? "用于支撑复购和评价请求。"
            : "Useful for post-visit follow-up and review requests.",
      },
    ],
    appointments: sorted,
    dependencies: [],
  };
}

function getPlaceholderSnapshot(locale: Locale): AppointmentsSnapshot {
  const appointments = appointmentRecords
    .map((appointment) => ({
      ...appointment,
      customerName:
        customerRecords.find(
          (customer) => customer.id === appointment.customerId,
        )?.name ?? appointment.customerId,
    }))
    .sort((left, right) => left.startsAt.localeCompare(right.startsAt));

  return {
    metrics: [
      {
        label: locale === "zh" ? "今日预约" : "Today's bookings",
        value: String(
          appointments.filter((appointment) =>
            appointment.startsAt.startsWith("2026-03-14"),
          ).length,
        ),
        helper:
          locale === "zh"
            ? "按当前占位日程显示今天的到店安排。"
            : "Shows the placeholder-safe count of visits for today.",
      },
      {
        label: locale === "zh" ? "待确认" : "Awaiting confirmation",
        value: String(
          appointments.filter((appointment) => appointment.status === "pending")
            .length,
        ),
        helper:
          locale === "zh"
            ? "仍需要人工确认时间或客户回复。"
            : "Still needs a customer reply or an operator confirmation.",
      },
      {
        label: locale === "zh" ? "提醒就绪" : "Reminders ready",
        value: String(
          appointments.filter((appointment) => appointment.reminderReady)
            .length,
        ),
        helper:
          locale === "zh"
            ? "可以进入提醒审核流程的预约。"
            : "Appointments that are ready for a manual reminder review.",
      },
      {
        label: locale === "zh" ? "已完成" : "Completed",
        value: String(
          appointments.filter(
            (appointment) => appointment.status === "completed",
          ).length,
        ),
        helper:
          locale === "zh"
            ? "用于支撑复购和评价请求。"
            : "Useful for post-visit follow-up and review requests.",
      },
    ],
    appointments,
    dependencies: [
      locale === "zh"
        ? "当前显示占位数据。请登录以加载真实预约数据。"
        : "Showing placeholder data. Sign in to load real appointment data.",
    ],
  };
}
