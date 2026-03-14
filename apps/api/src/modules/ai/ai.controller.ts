import { Body, Controller, Get, Post } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { RunAiTemplateDto } from "./dto/run-ai-template.dto";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  getOverview(): ModuleOverviewDto {
    return this.aiService.getOverview();
  }

  @Get("foundation")
  getFoundationSummary() {
    return this.aiService.getFoundationSummary();
  }

  @Post("preview")
  previewPrompt(@Body() body: RunAiTemplateDto) {
    return this.aiService.runTemplate(body);
  }
}
