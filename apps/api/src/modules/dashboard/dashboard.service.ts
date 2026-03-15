import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AppointmentStatus,
  CustomerStatus,
  MessageStatus,
  ReviewStatus,
} from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { DashboardSummaryDto } from "./dto/dashboard-summary.dto";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(workspaceId: string): Promise<DashboardSummaryDto> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        timezone: true,
        locale: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace "${workspaceId}" was not found.`);
    }

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    const [
      totalCustomers,
      newLeadCustomers,
      activeCustomers,
      bookedCustomers,
      totalAppointments,
      scheduledAppointments,
      confirmedAppointments,
      completedAppointments,
      canceledAppointments,
      upcomingAppointments,
      todayAppointments,
      nextAppointment,
      recentCustomers,
      totalMessages,
      draftMessages,
      sentMessages,
      failedMessages,
      totalReviews,
      requestedReviews,
      submittedReviews,
      ratedReviews,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { workspaceId } }),
      this.prisma.customer.count({
        where: { workspaceId, status: CustomerStatus.NEW_LEAD },
      }),
      this.prisma.customer.count({
        where: { workspaceId, status: CustomerStatus.ACTIVE },
      }),
      this.prisma.customer.count({
        where: { workspaceId, status: CustomerStatus.BOOKED },
      }),
      this.prisma.appointment.count({ where: { workspaceId } }),
      this.prisma.appointment.count({
        where: { workspaceId, status: AppointmentStatus.SCHEDULED },
      }),
      this.prisma.appointment.count({
        where: { workspaceId, status: AppointmentStatus.CONFIRMED },
      }),
      this.prisma.appointment.count({
        where: { workspaceId, status: AppointmentStatus.COMPLETED },
      }),
      this.prisma.appointment.count({
        where: { workspaceId, status: AppointmentStatus.CANCELED },
      }),
      this.prisma.appointment.count({
        where: {
          workspaceId,
          startsAt: { gte: now },
          status: {
            in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED],
          },
        },
      }),
      this.prisma.appointment.count({
        where: {
          workspaceId,
          startsAt: {
            gte: todayStart,
            lt: tomorrowStart,
          },
        },
      }),
      this.prisma.appointment.findFirst({
        where: {
          workspaceId,
          startsAt: { gte: now },
          status: {
            in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED],
          },
        },
        orderBy: { startsAt: "asc" },
        select: {
          id: true,
          customerId: true,
          startsAt: true,
          status: true,
          serviceName: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.customer.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.message.count({ where: { workspaceId } }),
      this.prisma.message.count({
        where: { workspaceId, status: MessageStatus.DRAFT },
      }),
      this.prisma.message.count({
        where: { workspaceId, status: MessageStatus.SENT },
      }),
      this.prisma.message.count({
        where: { workspaceId, status: MessageStatus.FAILED },
      }),
      this.prisma.review.count({ where: { workspaceId } }),
      this.prisma.review.count({
        where: { workspaceId, status: ReviewStatus.REQUESTED },
      }),
      this.prisma.review.count({
        where: { workspaceId, status: ReviewStatus.SUBMITTED },
      }),
      this.prisma.review.findMany({
        where: { workspaceId, rating: { not: null } },
        select: { rating: true },
      }),
    ]);

    const avgRating =
      ratedReviews.length > 0
        ? ratedReviews.reduce((s, r) => s + (r.rating ?? 0), 0) /
          ratedReviews.length
        : null;

    return {
      workspaceId: workspace.id,
      timezone: workspace.timezone,
      locale: workspace.locale,
      generatedAt: now,
      customers: {
        total: totalCustomers,
        newLeads: newLeadCustomers,
        active: activeCustomers,
        booked: bookedCustomers,
      },
      appointments: {
        total: totalAppointments,
        scheduled: scheduledAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        canceled: canceledAppointments,
        upcoming: upcomingAppointments,
        today: todayAppointments,
      },
      messaging: {
        total: totalMessages,
        draft: draftMessages,
        sent: sentMessages,
        failed: failedMessages,
      },
      reviews: {
        total: totalReviews,
        requested: requestedReviews,
        submitted: submittedReviews,
        averageRating: avgRating
          ? Math.round(avgRating * 10) / 10
          : null,
      },
      nextAppointment: nextAppointment
        ? {
            id: nextAppointment.id,
            customerId: nextAppointment.customerId,
            startsAt: nextAppointment.startsAt,
            status: nextAppointment.status,
            serviceName: nextAppointment.serviceName,
            customerName: [nextAppointment.customer.firstName, nextAppointment.customer.lastName]
              .filter((value): value is string => Boolean(value))
              .join(" "),
          }
        : null,
      recentCustomers: recentCustomers.map((customer) => ({
        id: customer.id,
        fullName: [customer.firstName, customer.lastName]
          .filter((value): value is string => Boolean(value))
          .join(" "),
        status: customer.status,
        createdAt: customer.createdAt,
      })),
    };
  }
}
