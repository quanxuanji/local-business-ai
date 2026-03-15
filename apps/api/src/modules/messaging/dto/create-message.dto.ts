import { MessageChannel, MessageStatus } from "@prisma/client";
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsDateString,
} from "class-validator";

export class CreateMessageDto {
  @IsString()
  @Length(1, 50)
  customerId!: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  appointmentId?: string;

  @IsEnum(MessageChannel)
  channel!: MessageChannel;

  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  subject?: string;

  @IsString()
  @Length(1, 5000)
  body!: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
