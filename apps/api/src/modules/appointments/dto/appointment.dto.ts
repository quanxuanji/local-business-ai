import { AppointmentStatus } from "@prisma/client";

export class AppointmentCustomerDto {
  id!: string;
  firstName!: string;
  lastName!: string | null;
  fullName!: string;
  email!: string | null;
  phone!: string | null;
}

export class AppointmentDto {
  id!: string;
  workspaceId!: string;
  customerId!: string;
  startsAt!: Date;
  endsAt!: Date | null;
  status!: AppointmentStatus;
  serviceName!: string | null;
  notes!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  customer!: AppointmentCustomerDto;
}
