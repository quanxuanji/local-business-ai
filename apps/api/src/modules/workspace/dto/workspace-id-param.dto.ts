import { IsString, Length } from "class-validator";

export class WorkspaceIdParamDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}
