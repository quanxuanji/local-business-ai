export const customerStatuses = [
  "new_lead",
  "contacted",
  "booked",
  "active",
  "inactive",
  "lost",
] as const;

export type CustomerStatus = (typeof customerStatuses)[number];

export const workflowTriggers = [
  "lead_created",
  "lead_not_contacted_24h",
  "appointment_booked",
  "appointment_reminder",
  "appointment_completed",
  "customer_inactive_30d",
] as const;

export type WorkflowTrigger = (typeof workflowTriggers)[number];

export const workflowActions = [
  "send_message",
  "create_task",
  "update_customer_status",
  "assign_owner",
  "request_review",
] as const;

export type WorkflowAction = (typeof workflowActions)[number];

export const messagingChannels = ["sms", "email"] as const;

export type MessagingChannel = (typeof messagingChannels)[number];

export const supportedLanguages = ["en", "zh"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export interface WorkspaceSummary {
  id: string;
  name: string;
  timezone: string;
  locale: SupportedLanguage;
}
