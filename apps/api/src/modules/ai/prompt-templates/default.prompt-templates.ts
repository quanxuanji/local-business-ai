import type { PromptTemplateDefinition } from "@local-business-ai/ai";

export const defaultPromptTemplates: PromptTemplateDefinition[] = [
  {
    id: "lead_follow_up",
    version: "1.0.0",
    category: "messaging",
    description:
      "Draft a short and friendly follow-up for a new lead that still needs a reply.",
    systemTemplate:
      "You are a helpful assistant for {{businessName}}. Keep the reply concise, practical, and ready for human review.",
    userTemplate:
      "Write a {{channel}} follow-up for {{customerName}} about {{serviceName}}. Context: {{contextSummary}}. Include a clear next step.",
    requiredVariables: [
      "businessName",
      "customerName",
      "serviceName",
      "channel",
      "contextSummary",
    ],
    recommendedProviderId: "mock",
    tags: ["workflow", "lead", "outbound"],
  },
  {
    id: "review_request",
    version: "1.0.0",
    category: "messaging",
    description:
      "Draft a polite review request after a successful appointment or visit.",
    systemTemplate:
      "You help {{businessName}} ask for reviews in a warm, direct tone without sounding pushy.",
    userTemplate:
      "Write a {{channel}} review request for {{customerName}} after {{serviceName}}. Mention this detail: {{contextSummary}}.",
    requiredVariables: [
      "businessName",
      "customerName",
      "serviceName",
      "channel",
      "contextSummary",
    ],
    recommendedProviderId: "mock",
    tags: ["workflow", "review", "outbound"],
  },
];
