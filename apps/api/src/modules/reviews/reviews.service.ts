import { Injectable } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";

@Injectable()
export class ReviewsService {
  getOverview(): ModuleOverviewDto {
    return {
      module: "reviews",
      phase: 4,
      summary:
        "Scaffold for review request tracking and review outcome storage tied back to customers and appointments.",
      nextSteps: [
        "Add review request and status endpoints",
        "Connect review requests to outbound messaging and workflow actions",
      ],
    };
  }
}
