import { MessageChannel, ReviewStatus } from "@prisma/client";
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsInt,
  Min,
  Max,
} from "class-validator";

export class CreateReviewDto {
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
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  comment?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  externalUrl?: string;
}
