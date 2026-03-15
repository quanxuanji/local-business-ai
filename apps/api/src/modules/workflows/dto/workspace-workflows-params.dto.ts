import { IsString, Length } from "class-validator";

export class WorkspaceWorkflowsParamsDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}

export class WorkflowRuleRouteParamsDto extends WorkspaceWorkflowsParamsDto {
  @IsString()
  @Length(1, 50)
  ruleId!: string;
}
