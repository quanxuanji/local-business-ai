import {
  CustomerStatus,
  PreferredLanguage,
} from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  lastName?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @Matches(/^[0-9+()\-\s]{7,20}$/)
  phone?: string | null;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsOptional()
  @IsEnum(PreferredLanguage)
  preferredLanguage?: PreferredLanguage;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  source?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  ownerId?: string | null;
}
