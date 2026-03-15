import type { Locale } from "./i18n";
import type { StatusBadgeTone } from "./status-tone";

export type { StatusBadgeTone };

const appointmentStatusLabels: Record<string, Record<string, string>> = {
  en: {
    SCHEDULED: "Scheduled",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  zh: {
    SCHEDULED: "已安排",
    CONFIRMED: "已确认",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
    NO_SHOW: "未到场",
    pending: "待处理",
    confirmed: "已确认",
    completed: "已完成",
    cancelled: "已取消",
  },
};

const reviewStatusLabels: Record<string, Record<string, string>> = {
  en: {
    REQUESTED: "Requested",
    SUBMITTED: "Submitted",
    PUBLISHED: "Published",
    DISMISSED: "Dismissed",
  },
  zh: {
    REQUESTED: "已请求",
    SUBMITTED: "已提交",
    PUBLISHED: "已发布",
    DISMISSED: "已驳回",
  },
};

const messageStatusLabels: Record<string, Record<string, string>> = {
  en: {
    DRAFT: "Draft",
    QUEUED: "Queued",
    SENT: "Sent",
    DELIVERED: "Delivered",
    FAILED: "Failed",
  },
  zh: {
    DRAFT: "草稿",
    QUEUED: "排队中",
    SENT: "已发送",
    DELIVERED: "已送达",
    FAILED: "失败",
  },
};

export function getAppointmentStatusLabel(
  locale: Locale,
  status: string,
): string {
  return appointmentStatusLabels[locale]?.[status] ?? status;
}

export function getAppointmentStatusTone(status: string): StatusBadgeTone {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "confirmed":
      return "info";
    case "cancelled":
    case "no_show":
      return "warning";
    default:
      return "neutral";
  }
}

export function getReviewStatusLabel(locale: Locale, status: string): string {
  return reviewStatusLabels[locale]?.[status] ?? status;
}

export function getReviewStatusTone(status: string): StatusBadgeTone {
  switch (status) {
    case "SUBMITTED":
    case "PUBLISHED":
      return "success";
    case "DISMISSED":
      return "warning";
    default:
      return "neutral";
  }
}

export function getMessageStatusLabel(locale: Locale, status: string): string {
  return messageStatusLabels[locale]?.[status] ?? status;
}

export function getMessageStatusTone(status: string): StatusBadgeTone {
  switch (status) {
    case "SENT":
    case "DELIVERED":
      return "success";
    case "FAILED":
      return "warning";
    default:
      return "neutral";
  }
}
