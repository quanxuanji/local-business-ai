import {
  AppointmentStatus,
  CustomerStatus,
} from "@prisma/client";

export class DashboardCustomerSummaryDto {
  total!: number;
  newLeads!: number;
  active!: number;
  booked!: number;
}

export class DashboardAppointmentSummaryDto {
  total!: number;
  scheduled!: number;
  confirmed!: number;
  completed!: number;
  canceled!: number;
  upcoming!: number;
  today!: number;
}

export class DashboardNextAppointmentDto {
  id!: string;
  customerId!: string;
  customerName!: string;
  startsAt!: Date;
  status!: AppointmentStatus;
  serviceName!: string | null;
}

export class DashboardRecentCustomerDto {
  id!: string;
  fullName!: string;
  status!: CustomerStatus;
  createdAt!: Date;
}

export class DashboardMessagingSummaryDto {
  total!: number;
  draft!: number;
  sent!: number;
  failed!: number;
}

export class DashboardReviewsSummaryDto {
  total!: number;
  requested!: number;
  submitted!: number;
  averageRating!: number | null;
}

export class DashboardSummaryDto {
  workspaceId!: string;
  timezone!: string;
  locale!: string;
  generatedAt!: Date;
  customers!: DashboardCustomerSummaryDto;
  appointments!: DashboardAppointmentSummaryDto;
  messaging!: DashboardMessagingSummaryDto;
  reviews!: DashboardReviewsSummaryDto;
  nextAppointment!: DashboardNextAppointmentDto | null;
  recentCustomers!: DashboardRecentCustomerDto[];
}
