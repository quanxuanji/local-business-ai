import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { AppointmentStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { DeleteAppointmentResponseDto } from "./dto/delete-appointment-response.dto";
import { ListAppointmentsQueryDto } from "./dto/list-appointments-query.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    await this.ensureWorkspaceExists(workspaceId);
    await this.ensureCustomerBelongsToWorkspace(
      workspaceId,
      createAppointmentDto.customerId,
    );

    const startsAt = new Date(createAppointmentDto.startsAt);
    const endsAt = createAppointmentDto.endsAt
      ? new Date(createAppointmentDto.endsAt)
      : null;

    this.assertValidTimeRange(startsAt, endsAt);

    const appointment = await this.prisma.appointment.create({
      data: {
        workspaceId,
        customerId: createAppointmentDto.customerId,
        startsAt,
        endsAt,
        status: createAppointmentDto.status,
        serviceName: createAppointmentDto.serviceName?.trim(),
        notes: createAppointmentDto.notes?.trim(),
      },
      include: this.appointmentInclude,
    });

    return this.toAppointmentDto(appointment);
  }

  async findAll(
    workspaceId: string,
    query: ListAppointmentsQueryDto,
  ): Promise<AppointmentDto[]> {
    await this.ensureWorkspaceExists(workspaceId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.AppointmentWhereInput = {
      workspaceId,
      ...(query.customerId ? { customerId: query.customerId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.from || query.to
        ? {
            startsAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: this.appointmentInclude,
      orderBy: { startsAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return appointments.map((appointment) => this.toAppointmentDto(appointment));
  }

  async findOne(
    workspaceId: string,
    appointmentId: string,
  ): Promise<AppointmentDto> {
    await this.ensureWorkspaceExists(workspaceId);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        workspaceId,
      },
      include: this.appointmentInclude,
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment "${appointmentId}" was not found in workspace "${workspaceId}".`,
      );
    }

    return this.toAppointmentDto(appointment);
  }

  async update(
    workspaceId: string,
    appointmentId: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentDto> {
    await this.ensureWorkspaceExists(workspaceId);

    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        workspaceId,
      },
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        customerId: true,
        status: true,
      },
    });

    if (!existingAppointment) {
      throw new NotFoundException(
        `Appointment "${appointmentId}" was not found in workspace "${workspaceId}".`,
      );
    }

    if (updateAppointmentDto.customerId) {
      await this.ensureCustomerBelongsToWorkspace(
        workspaceId,
        updateAppointmentDto.customerId,
      );
    }

    const startsAt = updateAppointmentDto.startsAt
      ? new Date(updateAppointmentDto.startsAt)
      : existingAppointment.startsAt;
    const endsAt =
      updateAppointmentDto.endsAt !== undefined
        ? updateAppointmentDto.endsAt
          ? new Date(updateAppointmentDto.endsAt)
          : null
        : existingAppointment.endsAt;

    this.assertValidTimeRange(startsAt, endsAt);
    this.assertValidUpdate(existingAppointment, updateAppointmentDto, startsAt);

    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(updateAppointmentDto.customerId
          ? { customerId: updateAppointmentDto.customerId }
          : {}),
        ...(updateAppointmentDto.startsAt ? { startsAt } : {}),
        ...(updateAppointmentDto.endsAt !== undefined ? { endsAt } : {}),
        ...(updateAppointmentDto.status !== undefined
          ? { status: updateAppointmentDto.status }
          : {}),
        ...(updateAppointmentDto.serviceName !== undefined
          ? { serviceName: updateAppointmentDto.serviceName?.trim() || null }
          : {}),
        ...(updateAppointmentDto.notes !== undefined
          ? { notes: updateAppointmentDto.notes?.trim() || null }
          : {}),
      },
      include: this.appointmentInclude,
    });

    return this.toAppointmentDto(appointment);
  }

  async remove(
    workspaceId: string,
    appointmentId: string,
  ): Promise<DeleteAppointmentResponseDto> {
    await this.ensureWorkspaceExists(workspaceId);
    await this.ensureAppointmentExists(workspaceId, appointmentId);

    // TODO: Enforce cancellation rules instead of hard deletes once audit history is added.
    await this.prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return {
      id: appointmentId,
      workspaceId,
      deleted: true,
    };
  }

  private readonly appointmentInclude = {
    customer: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    },
  } satisfies Prisma.AppointmentInclude;

  private async ensureWorkspaceExists(workspaceId: string): Promise<void> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace "${workspaceId}" was not found.`);
    }
  }

  private async ensureCustomerBelongsToWorkspace(
    workspaceId: string,
    customerId: string,
  ): Promise<void> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        workspaceId,
      },
      select: { id: true },
    });

    if (!customer) {
      throw new UnprocessableEntityException(
        `Customer "${customerId}" does not belong to workspace "${workspaceId}".`,
      );
    }
  }

  private async ensureAppointmentExists(
    workspaceId: string,
    appointmentId: string,
  ): Promise<void> {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        workspaceId,
      },
      select: { id: true },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment "${appointmentId}" was not found in workspace "${workspaceId}".`,
      );
    }
  }

  private assertValidTimeRange(startsAt: Date, endsAt: Date | null): void {
    if (Number.isNaN(startsAt.getTime())) {
      throw new UnprocessableEntityException("startsAt must be a valid ISO date.");
    }

    if (endsAt && Number.isNaN(endsAt.getTime())) {
      throw new UnprocessableEntityException("endsAt must be a valid ISO date.");
    }

    if (endsAt && endsAt <= startsAt) {
      throw new UnprocessableEntityException(
        "endsAt must be later than startsAt.",
      );
    }

    // TODO: Add staff availability and overlap checks when booking rules are defined.
  }

  private assertValidUpdate(
    existingAppointment: {
      id: string;
      startsAt: Date;
      endsAt: Date | null;
      customerId: string;
      status: AppointmentStatus;
    },
    updateAppointmentDto: UpdateAppointmentDto,
    nextStartsAt: Date,
  ): void {
    const nextStatus = updateAppointmentDto.status ?? existingAppointment.status;
    const isTerminalStatus = this.isTerminalStatus(existingAppointment.status);
    const isChangingSchedule =
      updateAppointmentDto.startsAt !== undefined ||
      updateAppointmentDto.endsAt !== undefined ||
      updateAppointmentDto.customerId !== undefined;

    if (isTerminalStatus && isChangingSchedule) {
      throw new UnprocessableEntityException(
        `Appointment "${existingAppointment.id}" is already ${existingAppointment.status.toLowerCase()} and cannot be rescheduled or reassigned.`,
      );
    }

    if (
      isTerminalStatus &&
      updateAppointmentDto.status !== undefined &&
      updateAppointmentDto.status !== existingAppointment.status
    ) {
      throw new UnprocessableEntityException(
        `Appointment "${existingAppointment.id}" is already ${existingAppointment.status.toLowerCase()} and cannot change to ${updateAppointmentDto.status.toLowerCase()}.`,
      );
    }

    if (
      nextStartsAt > new Date() &&
      (nextStatus === AppointmentStatus.COMPLETED ||
        nextStatus === AppointmentStatus.NO_SHOW)
    ) {
      throw new UnprocessableEntityException(
        `Future appointments cannot be marked as ${nextStatus.toLowerCase()}.`,
      );
    }

    if (
      updateAppointmentDto.status === AppointmentStatus.CANCELED &&
      updateAppointmentDto.startsAt !== undefined
    ) {
      throw new UnprocessableEntityException(
        "Canceled appointments cannot be rescheduled in the same update request.",
      );
    }

    // TODO: Add stricter status-transition policy when operator workflows are finalized.
  }

  private isTerminalStatus(status: AppointmentStatus): boolean {
    return (
      status === AppointmentStatus.COMPLETED ||
      status === AppointmentStatus.CANCELED ||
      status === AppointmentStatus.NO_SHOW
    );
  }

  private toAppointmentDto(appointment: {
    id: string;
    workspaceId: string;
    customerId: string;
    startsAt: Date;
    endsAt: Date | null;
    status: AppointmentStatus;
    serviceName: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    customer: {
      id: string;
      firstName: string;
      lastName: string | null;
      email: string | null;
      phone: string | null;
    };
  }): AppointmentDto {
    return {
      id: appointment.id,
      workspaceId: appointment.workspaceId,
      customerId: appointment.customerId,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      status: appointment.status,
      serviceName: appointment.serviceName,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      customer: {
        id: appointment.customer.id,
        firstName: appointment.customer.firstName,
        lastName: appointment.customer.lastName,
        fullName: [appointment.customer.firstName, appointment.customer.lastName]
          .filter((value): value is string => Boolean(value))
          .join(" "),
        email: appointment.customer.email,
        phone: appointment.customer.phone,
      },
    };
  }
}
