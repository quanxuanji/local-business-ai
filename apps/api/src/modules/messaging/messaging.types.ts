export interface MessagingPlaceholderRequest {
  workspaceId: string;
  customerId?: string;
  channel: "sms" | "email";
  body: string;
  source: "workflow_rule" | "manual";
  deliveryMode: "draft" | "simulate_send";
  recipient?: string;
}

export interface MessagingPlaceholderResult {
  id: string;
  status: "draft" | "simulated_send";
  provider: "placeholder";
  channel: "sms" | "email";
  body: string;
  recipient?: string;
}
