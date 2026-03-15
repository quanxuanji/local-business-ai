import { Module } from "@nestjs/common";

import { AiController } from "./ai.controller";
import { AiProviderRegistry } from "./ai-provider.registry";
import { MockAiProvider } from "./providers/mock-ai.provider";
import { OpenAiProvider } from "./providers/openai.provider";
import { PromptTemplateRegistry } from "./prompt-templates/prompt-template.registry";
import { AiService } from "./ai.service";

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    AiProviderRegistry,
    PromptTemplateRegistry,
    MockAiProvider,
    OpenAiProvider,
  ],
  exports: [AiService],
})
export class AiModule {}
