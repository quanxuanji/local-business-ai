import { IsEmail, IsOptional, IsString, Length, Matches } from "class-validator";

export class LoginDto {
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  workspaceSlug!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;
}
