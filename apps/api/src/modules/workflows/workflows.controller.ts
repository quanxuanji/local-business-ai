import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateWorkflowRuleDto } from "./dto/create-workflow-rule.dto";
import { ExecuteWorkflowRuleDto } from "./dto/execute-workflow-rule.dto";
import { UpdateWorkflowRuleDto } from "./dto/update-workflow-rule.dto";
import type { WorkflowRuleDto } from "./dto/workflow-rule.dto";
import {
  WorkflowRuleRouteParamsDto,
  WorkspaceWorkflowsParamsDto,
} from "./dto/workspace-workflows-params.dto";
import { WorkflowsService } from "./workflows.service";

@Controller("workspaces/:workspaceId/workflow-rules")
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  create(
    @Param() params: WorkspaceWorkflowsParamsDto,
    @Body() dto: CreateWorkflowRuleDto,
  ): Promise<WorkflowRuleDto> {
    return this.workflowsService.create(params.workspaceId, dto);
  }

  @Get()
  findAll(
    @Param() params: WorkspaceWorkflowsParamsDto,
  ): Promise<WorkflowRuleDto[]> {
    return this.workflowsService.findAll(params.workspaceId);
  }

  @Get(":ruleId")
  findOne(@Param() params: WorkflowRuleRouteParamsDto): Promise<WorkflowRuleDto> {
    return this.workflowsService.findOne(params.workspaceId, params.ruleId);
  }

  @Patch(":ruleId")
  update(
    @Param() params: WorkflowRuleRouteParamsDto,
    @Body() dto: UpdateWorkflowRuleDto,
  ): Promise<WorkflowRuleDto> {
    return this.workflowsService.update(
      params.workspaceId,
      params.ruleId,
      dto,
    );
  }

  @Delete(":ruleId")
  remove(
    @Param() params: WorkflowRuleRouteParamsDto,
  ): Promise<{ id: string; deleted: boolean }> {
    return this.workflowsService.remove(params.workspaceId, params.ruleId);
  }

  @Post("execute-preview")
  executePreview(@Body() body: ExecuteWorkflowRuleDto) {
    return this.workflowsService.executeRule(body.rule, body.context);
  }
}
