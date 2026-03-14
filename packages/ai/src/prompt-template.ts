export type PromptTemplateValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type PromptTemplateVariables = Record<string, PromptTemplateValue>;

export interface PromptTemplateDefinition {
  id: string;
  version: string;
  category: string;
  description: string;
  systemTemplate: string;
  userTemplate: string;
  requiredVariables: string[];
  recommendedProviderId?: string;
  tags?: string[];
}

export interface RenderedPromptTemplate {
  templateId: string;
  version: string;
  systemPrompt: string;
  userPrompt: string;
  variables: PromptTemplateVariables;
  missingVariables: string[];
}

const templateVariablePattern = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

function toStringValue(value: PromptTemplateValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function renderSegment(
  template: string,
  variables: PromptTemplateVariables,
): string {
  return template.replace(templateVariablePattern, (_, variableName: string) =>
    toStringValue(variables[variableName]),
  );
}

export function renderPromptTemplate(
  template: PromptTemplateDefinition,
  variables: PromptTemplateVariables,
): RenderedPromptTemplate {
  const missingVariables = template.requiredVariables.filter((variableName) => {
    const value = variables[variableName];
    return value === undefined || value === null || value === "";
  });

  return {
    templateId: template.id,
    version: template.version,
    systemPrompt: renderSegment(template.systemTemplate, variables),
    userPrompt: renderSegment(template.userTemplate, variables),
    variables,
    missingVariables,
  };
}
