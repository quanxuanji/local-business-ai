import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  WorkflowExecutionContext,
  WorkflowExecutionResult,
  WorkflowRuleDefinition,
} from "@local-business-ai/ai";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { WorkflowRuleExecutor } from "./workflow-rule.executor";
import type { CreateWorkflowRuleDto } from "./dto/create-workflow-rule.dto";
import type { UpdateWorkflowRuleDto } from "./dto/update-workflow-rule.dto";
import type { WorkflowRuleDto } from "./dto/workflow-rule.dto";

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowRuleExecutor: WorkflowRuleExecutor,
  ) {}

  async create(
    workspaceId: string,
    dto: CreateWorkflowRuleDto,
  ): Promise<WorkflowRuleDto> {
    const rule = await this.prisma.workflowRule.create({
      data: {
        workspaceId,
        name: dto.name,
        trigger: dto.trigger,
        action: dto.action,
        isActive: dto.isActive ?? true,
        config: dto.config
          ? (dto.config as Prisma.InputJsonValue)
          : Prisma.DbNull,
      },
    });
    return rule as unknown as WorkflowRuleDto;
  }

  async findAll(workspaceId: string): Promise<WorkflowRuleDto[]> {
    const rules = await this.prisma.workflowRule.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return rules as unknown as WorkflowRuleDto[];
  }

  async findOne(
    workspaceId: string,
    ruleId: string,
  ): Promise<WorkflowRuleDto> {
    const rule = await this.prisma.workflowRule.findFirst({
      where: { id: ruleId, workspaceId },
    });
    if (!rule) throw new NotFoundException("Workflow rule not found");
    return rule as unknown as WorkflowRuleDto;
  }

  async update(
    workspaceId: string,
    ruleId: string,
    dto: UpdateWorkflowRuleDto,
  ): Promise<WorkflowRuleDto> {
    const existing = await this.prisma.workflowRule.findFirst({
      where: { id: ruleId, workspaceId },
    });
    if (!existing) throw new NotFoundException("Workflow rule not found");

    const data: Prisma.WorkflowRuleUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.trigger !== undefined) data.trigger = dto.trigger;
    if (dto.action !== undefined) data.action = dto.action;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.config !== undefined)
      data.config = dto.config
        ? (dto.config as Prisma.InputJsonValue)
        : Prisma.DbNull;

    const updated = await this.prisma.workflowRule.update({
      where: { id: ruleId },
      data,
    });
    return updated as unknown as WorkflowRuleDto;
  }

  async remove(
    workspaceId: string,
    ruleId: string,
  ): Promise<{ id: string; deleted: boolean }> {
    const rule = await this.prisma.workflowRule.findFirst({
      where: { id: ruleId, workspaceId },
    });
    if (!rule) throw new NotFoundException("Workflow rule not found");

    await this.prisma.workflowRule.delete({ where: { id: ruleId } });
    return { id: ruleId, deleted: true };
  }

  async executeRule(
    rule: WorkflowRuleDefinition,
    context: WorkflowExecutionContext,
  ): Promise<WorkflowExecutionResult> {
    return this.workflowRuleExecutor.execute(rule, context);
  }
}
