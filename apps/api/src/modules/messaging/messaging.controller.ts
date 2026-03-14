import { Controller, Get } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { MessagingService } from "./messaging.service";

@Controller("messaging")
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  getOverview(): ModuleOverviewDto {
    return this.messagingService.getOverview();
  }
}
