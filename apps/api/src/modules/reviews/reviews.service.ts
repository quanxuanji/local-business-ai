import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ReviewStatus } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import type { CreateReviewDto } from "./dto/create-review.dto";
import type { UpdateReviewDto } from "./dto/update-review.dto";
import type { ReviewDto } from "./dto/review.dto";

const reviewInclude = {
  customer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
} satisfies Prisma.ReviewInclude;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateReviewDto): Promise<ReviewDto> {
    const review = await this.prisma.review.create({
      data: {
        workspaceId,
        customerId: dto.customerId,
        appointmentId: dto.appointmentId,
        channel: dto.channel,
        status: dto.status ?? ReviewStatus.REQUESTED,
        rating: dto.rating,
        comment: dto.comment,
        externalUrl: dto.externalUrl,
        requestedAt: new Date(),
      },
      include: reviewInclude,
    });
    return review as unknown as ReviewDto;
  }

  async findAll(
    workspaceId: string,
    customerId?: string,
  ): Promise<ReviewDto[]> {
    const where: Prisma.ReviewWhereInput = { workspaceId };
    if (customerId) where.customerId = customerId;

    const reviews = await this.prisma.review.findMany({
      where,
      include: reviewInclude,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return reviews as unknown as ReviewDto[];
  }

  async findOne(workspaceId: string, reviewId: string): Promise<ReviewDto> {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, workspaceId },
      include: reviewInclude,
    });
    if (!review) throw new NotFoundException("Review not found");
    return review as unknown as ReviewDto;
  }

  async update(
    workspaceId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, workspaceId },
    });
    if (!review) throw new NotFoundException("Review not found");

    const data: Prisma.ReviewUpdateInput = {};
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.rating !== undefined) data.rating = dto.rating;
    if (dto.comment !== undefined) data.comment = dto.comment;
    if (dto.externalUrl !== undefined) data.externalUrl = dto.externalUrl;

    if (dto.status === ReviewStatus.SUBMITTED && !review.submittedAt) {
      data.submittedAt = new Date();
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data,
      include: reviewInclude,
    });
    return updated as unknown as ReviewDto;
  }

  async remove(
    workspaceId: string,
    reviewId: string,
  ): Promise<{ id: string; deleted: boolean }> {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, workspaceId },
    });
    if (!review) throw new NotFoundException("Review not found");

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { id: reviewId, deleted: true };
  }
}
