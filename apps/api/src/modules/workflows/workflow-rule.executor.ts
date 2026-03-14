import { Injectable } from "@nestjs/common";
import type {
  PromptTemplateVariables,
  WorkflowExecutionContext,
  WorkflowExecutionLogEntry,
  WorkflowExecutionResult,
  WorkflowRuleDefinition,
} from "@local-business-ai/ai";

import { AiService } from "../ai/ai.service";
import { MessagingService } from "../messaging/messaging.service";

@Injectable()
export class WorkflowRuleExecutor {
  constructor(
    private readonly aiService: AiService,
    private readonly messagingService: MessagingService,
  ) {}

  async execute(
    rule: WorkflowRuleDefinition,
    context: WorkflowExecutionContext,
  ): Promise<WorkflowExecutionResult> {
    const operations: WorkflowExecutionLogEntry[] = [];
    const generatedContent: Record<string, string> = {};
    let hasPartialSignals = false;

    if (!rule.active) {
      return {
        ruleId: rule.id,
        status: "partial",
        generatedContent,
        operations: [
          {
            stepId: "rule",
            stepType: "create_task",
            status: "skipped",
            summary: "Workflow rule is inactive and was not executed.",
          },
        ],
      };
    }

    for (const step of rule.steps) {
      if (step.type === "generate_message") {
        const variables = this.mergeVariables(context.facts, step.overrides);
        const result = await this.aiService.runTemplate({
          templateId: step.templateId,
          providerId: step.providerId,
          variables,
        });

        generatedContent[step.outputKey] = result.output;
        hasPartialSignals =
          hasPartialSignals || result.prompt.missingVariables.length > 0;
        operations.push({
          stepId: step.id,
          stepType: step.type,
          status: "completed",
          summary: `Generated content for "${step.outputKey}" using template "${step.templateId}".`,
          data: {
            providerId: result.providerId,
            missingVariables: result.prompt.missingVariables,
          },
        });
        continue;
      }

      if (step.type === "send_message") {
        const body = generatedContent[step.contentKey];

        if (!body) {
          operations.push({
            stepId: step.id,
            stepType: step.type,
            status: "failed",
            summary: `No generated content was found for key "${step.contentKey}".`,
          });
          continue;
        }

        const placeholder = this.messagingService.createPlaceholder({
          workspaceId: context.workspaceId,
          customerId: context.customerId,
          channel: step.channel,
          body,
          source: "workflow_rule",
          deliveryMode: step.deliveryMode ?? "draft",
          recipient: step.recipient,
        });

        operations.push({
          stepId: step.id,
          stepType: step.type,
          status: "completed",
          summary: `Created ${placeholder.status} message placeholder for ${step.channel}.`,
          data: {
            placeholderId: placeholder.id,
            provider: placeholder.provider,
          },
        });
        continue;
      }

      operations.push({
        stepId: step.id,
        stepType: step.type,
        status: "completed",
        summary: `Task placeholder created: ${step.title}.`,
        data: {
          description: step.description,
        },
      });
    }

    const hasFailures = operations.some((operation) => operation.status === "failed");
    const hasSkips = operations.some((operation) => operation.status === "skipped");

    return {
      ruleId: rule.id,
      status:
        hasFailures
          ? "failed"
          : hasSkips || hasPartialSignals
            ? "partial"
            : "completed",
      generatedContent,
      operations,
    };
  }

  private mergeVariables(
    facts: PromptTemplateVariables,
    overrides?: PromptTemplateVariables,
  ): PromptTemplateVariables {
    return {
      ...facts,
      ...overrides,
    };
  }
}
