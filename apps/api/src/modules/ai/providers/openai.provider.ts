import { Injectable } from "@nestjs/common";
import type {
  AiProvider,
  AiProviderDescriptor,
  AiProviderGenerateTextParams,
  AiProviderTextResult,
} from "@local-business-ai/ai";

@Injectable()
export class OpenAiProvider implements AiProvider {
  private readonly descriptor: AiProviderDescriptor = {
    id: "openai",
    label: "OpenAI",
    kind: "openai",
    defaultModel: "gpt-4o-mini",
    supportsStructuredOutput: true,
  };

  getDescriptor(): AiProviderDescriptor {
    return this.descriptor;
  }

  async generateText(
    params: AiProviderGenerateTextParams,
  ): Promise<AiProviderTextResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return this.fallbackToMock(params);
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: params.metadata?.model ?? this.descriptor.defaultModel,
            messages: [
              { role: "system", content: params.systemPrompt },
              { role: "user", content: params.userPrompt },
            ],
            max_tokens: params.maxTokens ?? 500,
            temperature: params.temperature ?? 0.7,
          }),
        },
      );

      if (!response.ok) {
        return this.fallbackToMock(params);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string }; finish_reason: string }>;
        usage?: { prompt_tokens: number; completion_tokens: number };
      };

      const choice = data.choices?.[0];

      return {
        providerId: this.descriptor.id,
        model: String(params.metadata?.model ?? this.descriptor.defaultModel),
        text: choice?.message?.content ?? "",
        finishReason: choice?.finish_reason === "stop" ? "stop" : "length",
        usage: data.usage
          ? {
              inputTokens: data.usage.prompt_tokens,
              outputTokens: data.usage.completion_tokens,
            }
          : undefined,
        raw: data,
      };
    } catch {
      return this.fallbackToMock(params);
    }
  }

  private fallbackToMock(
    params: AiProviderGenerateTextParams,
  ): AiProviderTextResult {
    const text = `[OpenAI unavailable — mock response] Based on the context provided: "${params.userPrompt.slice(0, 200)}...", here is a suggested draft response. Please review and customize before sending.`;
    return {
      providerId: this.descriptor.id,
      model: "fallback-mock",
      text,
      finishReason: "mock",
    };
  }
}
