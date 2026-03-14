import { Controller, Get } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getOverview(): ModuleOverviewDto {
    return this.reviewsService.getOverview();
  }
}
