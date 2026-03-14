import { CustomerStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export enum CustomerListSortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  FIRST_NAME = "firstName",
  STATUS = "status",
}

export enum CustomerListSortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class ListCustomersQueryDto {
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  ownerId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsEnum(CustomerListSortBy)
  sortBy?: CustomerListSortBy;

  @IsOptional()
  @IsEnum(CustomerListSortOrder)
  sortOrder?: CustomerListSortOrder;
}
