import { Body, Controller, Get, Post } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { ExecuteWorkflowRuleDto } from "./dto/execute-workflow-rule.dto";
import { WorkflowsService } from "./workflows.service";

@Controller("workflows")
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  getOverview(): ModuleOverviewDto {
    return this.workflowsService.getOverview();
  }

  @Post("execute-preview")
  executePreview(@Body() body: ExecuteWorkflowRuleDto) {
    return this.workflowsService.executeRule(body.rule, body.context);
  }
}
