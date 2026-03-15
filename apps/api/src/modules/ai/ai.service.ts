import { Injectable } from "@nestjs/common";
import type {
  AiProviderTextResult,
  PromptTemplateDefinition,
  PromptTemplateVariables,
} from "@local-business-ai/ai";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { AiProviderRegistry } from "./ai-provider.registry";
import { PromptTemplateRegistry } from "./prompt-templates/prompt-template.registry";
import type {
  CustomerSummaryDto,
  LeadIntentDto,
  MessageRewriteDto,
  NextActionDto,
} from "./dto/customer-summary.dto";

@Injectable()
export class AiService {
  constructor(
    private readonly aiProviderRegistry: AiProviderRegistry,
    private readonly promptTemplateRegistry: PromptTemplateRegistry,
  ) {}

  getOverview(): ModuleOverviewDto {
    return {
      module: "ai",
      phase: 2,
      summary:
        "AI foundation with OpenAI integration, customer summary, message rewrite, next-action suggestion, and lead intent classification.",
      nextSteps: [
        "Keep human review in front of any customer-facing delivery path",
        "Add fine-tuned prompts based on business domain",
      ],
      futureExtensions: [
        "Anthropic adapter can plug in without changing workflow code",
      ],
    };
  }

  getFoundationSummary(): {
    defaultProviderId: string;
    providers: ReturnType<AiProviderRegistry["list"]>;
    templates: PromptTemplateDefinition[];
  } {
    const providers = this.aiProviderRegistry.list();

    return {
      defaultProviderId: providers[0]?.id ?? "mock",
      providers,
      templates: this.promptTemplateRegistry.list(),
    };
  }

  async runTemplate(input: {
    templateId: string;
    providerId?: string;
    variables?: Record<string, unknown>;
  }): Promise<{
    template: string;
    providerId: string;
    model: string;
    prompt: {
      system: string;
      user: string;
      missingVariables: string[];
    };
    output: string;
    usage?: AiProviderTextResult["usage"];
  }> {
    const variables = this.toPromptTemplateVariables(input.variables);
    const renderedPrompt = this.promptTemplateRegistry.render(
      input.templateId,
      variables,
    );
    const provider = this.aiProviderRegistry.get(input.providerId);
    const result = await provider.generateText({
      templateId: input.templateId,
      systemPrompt: renderedPrompt.systemPrompt,
      userPrompt: renderedPrompt.userPrompt,
      variables,
    });

    return {
      template: input.templateId,
      providerId: result.providerId,
      model: result.model,
      prompt: {
        system: renderedPrompt.systemPrompt,
        user: renderedPrompt.userPrompt,
        missingVariables: renderedPrompt.missingVariables,
      },
      output: result.text,
      usage: result.usage,
    };
  }

  async customerSummary(
    dto: CustomerSummaryDto,
  ): Promise<{ summary: string; providerId: string }> {
    const provider = this.aiProviderRegistry.get("openai");
    const result = await provider.generateText({
      systemPrompt:
        "You are a helpful CRM assistant. Generate a concise 2-3 sentence customer summary for a local business operator. Focus on actionable insights.",
      userPrompt: `Customer: ${dto.customerName}\nStatus: ${dto.status ?? "unknown"}\nNotes: ${dto.notes ?? "none"}\nBusiness: ${dto.businessName ?? "Local Business"}\n\nGenerate a brief customer profile summary highlighting key characteristics and engagement history.`,
      temperature: 0.5,
      maxTokens: 200,
    });

    return { summary: result.text, providerId: result.providerId };
  }

  async messageRewrite(
    dto: MessageRewriteDto,
  ): Promise<{ rewritten: string; providerId: string }> {
    const provider = this.aiProviderRegistry.get("openai");
    const result = await provider.generateText({
      systemPrompt: `You are a communication assistant for a local business. Rewrite the message in a ${dto.tone ?? "professional and friendly"} tone. Keep it concise and suitable for ${dto.channel ?? "SMS"}.`,
      userPrompt: `Original message:\n"${dto.originalMessage}"\n\nRewrite this message to be more effective for customer communication.`,
      temperature: 0.6,
      maxTokens: 300,
    });

    return { rewritten: result.text, providerId: result.providerId };
  }

  async nextAction(
    dto: NextActionDto,
  ): Promise<{ suggestion: string; providerId: string }> {
    const provider = this.aiProviderRegistry.get("openai");
    const result = await provider.generateText({
      systemPrompt:
        "You are a CRM strategy assistant for local businesses. Suggest the single most impactful next action for this customer. Be specific and actionable. Output only the recommendation in 1-2 sentences.",
      userPrompt: `Customer: ${dto.customerName}\nStatus: ${dto.status ?? "unknown"}\nContext: ${dto.context ?? "No additional context"}\n\nWhat should the operator do next with this customer?`,
      temperature: 0.5,
      maxTokens: 150,
    });

    return { suggestion: result.text, providerId: result.providerId };
  }

  async leadIntent(
    dto: LeadIntentDto,
  ): Promise<{ intent: string; confidence: string; providerId: string }> {
    const provider = this.aiProviderRegistry.get("openai");
    const result = await provider.generateText({
      systemPrompt:
        'You are a lead qualification assistant. Classify the lead intent into one of: HIGH_INTENT (ready to book), MEDIUM_INTENT (interested, needs nurturing), LOW_INTENT (browsing, not ready), or UNKNOWN. Also provide a confidence level: HIGH, MEDIUM, or LOW. Output JSON format: {"intent": "...", "confidence": "..."}',
      userPrompt: `Lead: ${dto.customerName}\nMessage: "${dto.messageContent}"\n\nClassify the intent.`,
      temperature: 0.3,
      maxTokens: 100,
    });

    try {
      const parsed = JSON.parse(result.text) as {
        intent: string;
        confidence: string;
      };
      return {
        intent: parsed.intent ?? "UNKNOWN",
        confidence: parsed.confidence ?? "LOW",
        providerId: result.providerId,
      };
    } catch {
      return {
        intent: "UNKNOWN",
        confidence: "LOW",
        providerId: result.providerId,
      };
    }
  }

  private toPromptTemplateVariables(
    variables?: Record<string, unknown>,
  ): PromptTemplateVariables {
    const normalizedVariables: PromptTemplateVariables = {};

    for (const [key, value] of Object.entries(variables ?? {})) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null ||
        value === undefined
      ) {
        normalizedVariables[key] = value;
      }
    }

    return normalizedVariables;
  }
}
