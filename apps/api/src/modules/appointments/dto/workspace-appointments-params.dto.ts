import { IsString, Length } from "class-validator";

export class WorkspaceAppointmentsParamsDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}

export class AppointmentRouteParamsDto extends WorkspaceAppointmentsParamsDto {
  @IsString()
  @Length(1, 50)
  appointmentId!: string;
}
