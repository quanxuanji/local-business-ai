import { IsObject } from "class-validator";
import type {
  WorkflowExecutionContext,
  WorkflowRuleDefinition,
} from "@local-business-ai/ai";

export class ExecuteWorkflowRuleDto {
  @IsObject()
  rule!: WorkflowRuleDefinition;

  @IsObject()
  context!: WorkflowExecutionContext;
}
