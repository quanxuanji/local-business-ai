import { Injectable } from "@nestjs/common";
import type {
  AiProvider,
  AiProviderDescriptor,
  AiProviderGenerateTextParams,
  AiProviderTextResult,
} from "@local-business-ai/ai";

function estimateTokens(input: string): number {
  return Math.max(1, Math.ceil(input.trim().length / 4));
}

function readString(
  variables: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const value = variables?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

@Injectable()
export class MockAiProvider implements AiProvider {
  private readonly descriptor: AiProviderDescriptor = {
    id: "mock",
    label: "Mock AI",
    kind: "mock",
    defaultModel: "mock-template-v1",
    supportsStructuredOutput: false,
  };

  getDescriptor(): AiProviderDescriptor {
    return this.descriptor;
  }

  async generateText(
    params: AiProviderGenerateTextParams,
  ): Promise<AiProviderTextResult> {
    const customerName = readString(params.variables, "customerName", "there");
    const businessName = readString(params.variables, "businessName", "our team");
    const serviceName = readString(params.variables, "serviceName", "your request");
    const contextSummary = readString(
      params.variables,
      "contextSummary",
      "following up on your recent activity",
    );

    const text = this.buildTemplateAwareCopy({
      templateId: params.templateId,
      customerName,
      businessName,
      serviceName,
      contextSummary,
      channel: readString(params.variables, "channel", "message"),
    });

    return {
      providerId: this.descriptor.id,
      model: this.descriptor.defaultModel,
      text,
      finishReason: "mock",
      usage: {
        inputTokens: estimateTokens(`${params.systemPrompt}\n${params.userPrompt}`),
        outputTokens: estimateTokens(text),
      },
      raw: {
        providerKind: this.descriptor.kind,
      },
    };
  }

  private buildTemplateAwareCopy(input: {
    templateId?: string;
    customerName: string;
    businessName: string;
    serviceName: string;
    contextSummary: string;
    channel: string;
  }): string {
    if (input.templateId === "review_request") {
      return `Hi ${input.customerName}, thanks again for choosing ${input.businessName} for ${input.serviceName}. ${input.contextSummary}. If you have a minute, we'd really appreciate a quick review.`;
    }

    return `Hi ${input.customerName}, this is ${input.businessName} checking in about ${input.serviceName}. ${input.contextSummary}. Let us know if you'd like to continue over ${input.channel}.`;
  }
}
