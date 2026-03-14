import { IsString, Length } from "class-validator";

export class DashboardWorkspaceParamsDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}
