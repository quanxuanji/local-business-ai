import { MessageChannel, MessageStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ListMessagesQueryDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsEnum(MessageChannel)
  channel?: MessageChannel;

  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}
