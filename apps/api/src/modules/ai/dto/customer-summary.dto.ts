import { IsOptional, IsString, Length } from "class-validator";

export class CustomerSummaryDto {
  @IsString()
  @Length(1, 50)
  customerId!: string;

  @IsString()
  @Length(1, 200)
  customerName!: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  businessName?: string;
}

export class MessageRewriteDto {
  @IsString()
  @Length(1, 5000)
  originalMessage!: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  tone?: string;

  @IsOptional()
  @IsString()
  channel?: string;
}

export class NextActionDto {
  @IsString()
  @Length(1, 50)
  customerId!: string;

  @IsString()
  @Length(1, 200)
  customerName!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  context?: string;
}

export class LeadIntentDto {
  @IsString()
  @Length(1, 200)
  customerName!: string;

  @IsString()
  @Length(1, 2000)
  messageContent!: string;
}
