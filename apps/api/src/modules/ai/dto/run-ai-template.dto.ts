import { IsObject, IsOptional, IsString } from "class-validator";

export class RunAiTemplateDto {
  @IsString()
  templateId!: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>;
}
