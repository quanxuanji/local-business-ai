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

import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import type { ReviewDto } from "./dto/review.dto";
import {
  ReviewRouteParamsDto,
  WorkspaceReviewsParamsDto,
} from "./dto/workspace-reviews-params.dto";

@Controller("workspaces/:workspaceId/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @Param() params: WorkspaceReviewsParamsDto,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewsService.create(params.workspaceId, dto);
  }

  @Get()
  findAll(
    @Param() params: WorkspaceReviewsParamsDto,
    @Query("customerId") customerId?: string,
  ): Promise<ReviewDto[]> {
    return this.reviewsService.findAll(params.workspaceId, customerId);
  }

  @Get(":reviewId")
  findOne(@Param() params: ReviewRouteParamsDto): Promise<ReviewDto> {
    return this.reviewsService.findOne(params.workspaceId, params.reviewId);
  }

  @Patch(":reviewId")
  update(
    @Param() params: ReviewRouteParamsDto,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewsService.update(
      params.workspaceId,
      params.reviewId,
      dto,
    );
  }

  @Delete(":reviewId")
  remove(
    @Param() params: ReviewRouteParamsDto,
  ): Promise<{ id: string; deleted: boolean }> {
    return this.reviewsService.remove(params.workspaceId, params.reviewId);
  }
}
