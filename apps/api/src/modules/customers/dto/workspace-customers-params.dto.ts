import { IsString, Length } from "class-validator";

export class WorkspaceCustomersParamsDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}

export class CustomerRouteParamsDto extends WorkspaceCustomersParamsDto {
  @IsString()
  @Length(1, 50)
  customerId!: string;
}
