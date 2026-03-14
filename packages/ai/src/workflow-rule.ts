import type { PromptTemplateVariables } from "./prompt-template";

export interface WorkflowExecutionContext {
  workspaceId: string;
  trigger: string;
  customerId?: string;
  facts: PromptTemplateVariables;
}

export interface WorkflowRuleDefinition {
  id: string;
  name: string;
  active: boolean;
  trigger: string;
  steps: WorkflowRuleStep[];
}

export interface WorkflowGenerateMessageStep {
  id: string;
  type: "generate_message";
  templateId: string;
  outputKey: string;
  providerId?: string;
  overrides?: PromptTemplateVariables;
}

export interface WorkflowSendMessageStep {
  id: string;
  type: "send_message";
  channel: "sms" | "email";
  contentKey: string;
  recipient?: string;
  deliveryMode?: "draft" | "simulate_send";
}

export interface WorkflowCreateTaskStep {
  id: string;
  type: "create_task";
  title: string;
  description?: string;
}

export type WorkflowRuleStep =
  | WorkflowGenerateMessageStep
  | WorkflowSendMessageStep
  | WorkflowCreateTaskStep;

export interface WorkflowExecutionLogEntry {
  stepId: string;
  stepType: WorkflowRuleStep["type"];
  status: "completed" | "skipped" | "failed";
  summary: string;
  data?: Record<string, unknown>;
}

export interface WorkflowExecutionResult {
  ruleId: string;
  status: "completed" | "partial" | "failed";
  generatedContent: Record<string, string>;
  operations: WorkflowExecutionLogEntry[];
}
