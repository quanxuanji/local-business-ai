import type { Locale } from "../../lib/i18n";
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

export async function getAppointmentsSnapshot(
  locale: Locale,
): Promise<AppointmentsSnapshot> {
  // API integration point: replace this placeholder projection with the
  // appointments list endpoint once booking operations are exposed to the web.
  const appointments = appointmentRecords
    .map((appointment) => ({
      ...appointment,
      customerName:
        customerRecords.find((customer) => customer.id === appointment.customerId)
          ?.name ?? appointment.customerId,
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
          appointments.filter((appointment) => appointment.reminderReady).length,
        ),
        helper:
          locale === "zh"
            ? "可以进入提醒审核流程的预约。"
            : "Appointments that are ready for a manual reminder review.",
      },
      {
        label: locale === "zh" ? "已完成" : "Completed",
        value: String(
          appointments.filter((appointment) => appointment.status === "completed")
            .length,
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
        ? "预约页面后续应接入真实日历、过滤器和状态更新接口。"
        : "Appointments page still needs live calendar, filters, and status mutation endpoints.",
      locale === "zh"
        ? "提醒审核状态目前是占位字段，后续由 workflow/read model 驱动。"
        : "Reminder readiness is placeholder-only until workflow state is exposed.",
    ],
  };
}
