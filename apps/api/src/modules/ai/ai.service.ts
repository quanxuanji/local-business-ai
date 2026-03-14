import { Injectable } from "@nestjs/common";
import type {
  AiProviderTextResult,
  PromptTemplateDefinition,
  PromptTemplateVariables,
} from "@local-business-ai/ai";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { AiProviderRegistry } from "./ai-provider.registry";
import { PromptTemplateRegistry } from "./prompt-templates/prompt-template.registry";

@Injectable()
export class AiService {
  constructor(
    private readonly aiProviderRegistry: AiProviderRegistry,
    private readonly promptTemplateRegistry: PromptTemplateRegistry,
  ) {}

  getOverview(): ModuleOverviewDto {
    return {
      module: "ai",
      phase: 1,
      summary:
        "Thin AI foundation with a provider registry, prompt templates, and mock-backed generation for safe early workflow integration.",
      nextSteps: [
        "Add real provider adapters behind the existing registry interface",
        "Keep human review in front of any customer-facing delivery path",
      ],
      futureExtensions: [
        "OpenAI and Anthropic adapters can plug in without changing workflow code",
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
