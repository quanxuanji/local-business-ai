import { AppointmentStatus } from "@prisma/client";
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  @Length(1, 50)
  customerId!: string;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus = AppointmentStatus.SCHEDULED;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  serviceName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string;
}
