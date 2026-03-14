import { IsString, Length } from "class-validator";

export class LogoutDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;

  @IsString()
  @Length(1, 50)
  userId!: string;
}
