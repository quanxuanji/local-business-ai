import { Injectable, NotFoundException } from "@nestjs/common";
import type { AiProvider, AiProviderDescriptor } from "@local-business-ai/ai";

import { MockAiProvider } from "./providers/mock-ai.provider";

@Injectable()
export class AiProviderRegistry {
  private readonly providers: AiProvider[];

  constructor(private readonly mockAiProvider: MockAiProvider) {
    this.providers = [mockAiProvider];
  }

  list(): AiProviderDescriptor[] {
    return this.providers.map((provider) => provider.getDescriptor());
  }

  get(providerId?: string): AiProvider {
    const resolvedProviderId = providerId ?? this.providers[0]?.getDescriptor().id;
    const provider = this.providers.find(
      (candidate) => candidate.getDescriptor().id === resolvedProviderId,
    );

    if (!provider) {
      throw new NotFoundException(
        `AI provider "${resolvedProviderId}" is not registered.`,
      );
    }

    return provider;
  }
}
