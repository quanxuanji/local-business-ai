import { IsString, Length } from "class-validator";

export class WorkspaceMessagesParamsDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}

export class MessageRouteParamsDto extends WorkspaceMessagesParamsDto {
  @IsString()
  @Length(1, 50)
  messageId!: string;
}
