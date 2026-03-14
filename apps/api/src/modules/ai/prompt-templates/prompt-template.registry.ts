import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  PromptTemplateDefinition,
  PromptTemplateVariables,
  RenderedPromptTemplate,
} from "@local-business-ai/ai";

import { defaultPromptTemplates } from "./default.prompt-templates";

const templateVariablePattern = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

function renderSegment(
  template: string,
  variables: PromptTemplateVariables,
): string {
  return template.replace(templateVariablePattern, (_, variableName: string) => {
    const value = variables[variableName];
    return value === null || value === undefined ? "" : String(value);
  });
}

@Injectable()
export class PromptTemplateRegistry {
  private readonly templates = new Map<string, PromptTemplateDefinition>(
    defaultPromptTemplates.map((template) => [template.id, template]),
  );

  list(): PromptTemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  get(templateId: string): PromptTemplateDefinition {
    const template = this.templates.get(templateId);

    if (!template) {
      throw new NotFoundException(
        `Prompt template "${templateId}" is not registered.`,
      );
    }

    return template;
  }

  render(
    templateId: string,
    variables: PromptTemplateVariables,
  ): RenderedPromptTemplate {
    const template = this.get(templateId);

    return {
      templateId: template.id,
      version: template.version,
      systemPrompt: renderSegment(template.systemTemplate, variables),
      userPrompt: renderSegment(template.userTemplate, variables),
      variables,
      missingVariables: template.requiredVariables.filter((variableName) => {
        const value = variables[variableName];
        return value === undefined || value === null || value === "";
      }),
    };
  }
}
