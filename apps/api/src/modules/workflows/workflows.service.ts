import { Injectable } from "@nestjs/common";
import type {
  WorkflowExecutionContext,
  WorkflowExecutionResult,
  WorkflowRuleDefinition,
} from "@local-business-ai/ai";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { WorkflowRuleExecutor } from "./workflow-rule.executor";

@Injectable()
export class WorkflowsService {
  constructor(private readonly workflowRuleExecutor: WorkflowRuleExecutor) {}

  getOverview(): ModuleOverviewDto {
    return {
      module: "workflows",
      phase: 1,
      summary:
        "Sequential workflow skeleton that can execute lightweight AI-backed rules without async infrastructure.",
      nextSteps: [
        "Store workflow rules once the MVP trigger set is stable",
        "Add more step types only when there is a real business need",
      ],
      futureExtensions: [
        "Async processing can remain optional until rule volume justifies it",
      ],
    };
  }

  async executeRule(
    rule: WorkflowRuleDefinition,
    context: WorkflowExecutionContext,
  ): Promise<WorkflowExecutionResult> {
    return this.workflowRuleExecutor.execute(rule, context);
  }
}
