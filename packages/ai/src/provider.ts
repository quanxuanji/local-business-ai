export interface AiProviderDescriptor {
  id: string;
  label: string;
  kind: string;
  defaultModel: string;
  supportsStructuredOutput: boolean;
}

export interface AiTokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface AiProviderGenerateTextParams {
  templateId?: string;
  systemPrompt: string;
  userPrompt: string;
  variables?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export interface AiProviderTextResult {
  providerId: string;
  model: string;
  text: string;
  finishReason: "stop" | "length" | "mock";
  usage?: AiTokenUsage;
  raw?: unknown;
}

export interface AiProvider {
  getDescriptor(): AiProviderDescriptor;
  generateText(
    params: AiProviderGenerateTextParams,
  ): Promise<AiProviderTextResult>;
}
