import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { AppointmentsService } from "./appointments.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { DeleteAppointmentResponseDto } from "./dto/delete-appointment-response.dto";
import { ListAppointmentsQueryDto } from "./dto/list-appointments-query.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import {
  AppointmentRouteParamsDto,
  WorkspaceAppointmentsParamsDto,
} from "./dto/workspace-appointments-params.dto";

@Controller("workspaces/:workspaceId/appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @Param() params: WorkspaceAppointmentsParamsDto,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    return this.appointmentsService.create(
      params.workspaceId,
      createAppointmentDto,
    );
  }

  @Get()
  findAll(
    @Param() params: WorkspaceAppointmentsParamsDto,
    @Query() query: ListAppointmentsQueryDto,
  ): Promise<AppointmentDto[]> {
    return this.appointmentsService.findAll(params.workspaceId, query);
  }

  @Get(":appointmentId")
  findOne(@Param() params: AppointmentRouteParamsDto): Promise<AppointmentDto> {
    return this.appointmentsService.findOne(
      params.workspaceId,
      params.appointmentId,
    );
  }

  @Patch(":appointmentId")
  update(
    @Param() params: AppointmentRouteParamsDto,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentDto> {
    return this.appointmentsService.update(
      params.workspaceId,
      params.appointmentId,
      updateAppointmentDto,
    );
  }

  @Delete(":appointmentId")
  remove(
    @Param() params: AppointmentRouteParamsDto,
  ): Promise<DeleteAppointmentResponseDto> {
    return this.appointmentsService.remove(
      params.workspaceId,
      params.appointmentId,
    );
  }
}
