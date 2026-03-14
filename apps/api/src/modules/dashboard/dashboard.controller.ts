import { Controller, Get, Param } from "@nestjs/common";

import { DashboardService } from "./dashboard.service";
import { DashboardSummaryDto } from "./dto/dashboard-summary.dto";
import { DashboardWorkspaceParamsDto } from "./dto/dashboard-workspace-params.dto";

@Controller("workspaces/:workspaceId/dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  getSummary(
    @Param() params: DashboardWorkspaceParamsDto,
  ): Promise<DashboardSummaryDto> {
    return this.dashboardService.getSummary(params.workspaceId);
  }
}
