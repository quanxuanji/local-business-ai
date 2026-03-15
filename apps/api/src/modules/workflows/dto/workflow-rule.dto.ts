import { WorkflowAction, WorkflowTrigger } from "@prisma/client";

export class WorkflowRuleDto {
  id!: string;
  workspaceId!: string;
  name!: string;
  trigger!: WorkflowTrigger;
  action!: WorkflowAction;
  isActive!: boolean;
  config!: unknown;
  createdAt!: Date;
  updatedAt!: Date;
}
