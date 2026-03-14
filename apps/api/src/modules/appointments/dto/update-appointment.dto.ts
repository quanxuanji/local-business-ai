import { AppointmentStatus } from "@prisma/client";
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  customerId?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string | null;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  serviceName?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string | null;
}
