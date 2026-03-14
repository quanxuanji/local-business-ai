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

export class CreateCustomerDto {
  @IsString()
  @Length(1, 120)
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^[0-9+()\-\s]{7,20}$/)
  phone?: string;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status: CustomerStatus = CustomerStatus.NEW_LEAD;

  @IsOptional()
  @IsEnum(PreferredLanguage)
  preferredLanguage: PreferredLanguage = PreferredLanguage.EN;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  source?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  ownerId?: string;
}
