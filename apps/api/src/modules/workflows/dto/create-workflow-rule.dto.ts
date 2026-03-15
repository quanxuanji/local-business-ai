import { WorkflowAction, WorkflowTrigger } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateWorkflowRuleDto {
  @IsString()
  @Length(1, 200)
  name!: string;

  @IsEnum(WorkflowTrigger)
  trigger!: WorkflowTrigger;

  @IsEnum(WorkflowAction)
  action!: WorkflowAction;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}
