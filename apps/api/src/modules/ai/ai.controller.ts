import { Body, Controller, Get, Post } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import {
  CustomerSummaryDto,
  LeadIntentDto,
  MessageRewriteDto,
  NextActionDto,
} from "./dto/customer-summary.dto";
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

  @Post("customer-summary")
  async customerSummary(@Body() dto: CustomerSummaryDto) {
    return this.aiService.customerSummary(dto);
  }

  @Post("message-rewrite")
  async messageRewrite(@Body() dto: MessageRewriteDto) {
    return this.aiService.messageRewrite(dto);
  }

  @Post("next-action")
  async nextAction(@Body() dto: NextActionDto) {
    return this.aiService.nextAction(dto);
  }

  @Post("lead-intent")
  async leadIntent(@Body() dto: LeadIntentDto) {
    return this.aiService.leadIntent(dto);
  }
}
