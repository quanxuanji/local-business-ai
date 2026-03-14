import { IsOptional, IsString, Length, Matches } from "class-validator";

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  timezone?: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  locale?: string;
}
