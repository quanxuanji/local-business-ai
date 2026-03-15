import { IsString, Length } from "class-validator";

export class WorkspaceReviewsParamsDto {
  @IsString()
  @Length(1, 50)
  workspaceId!: string;
}

export class ReviewRouteParamsDto extends WorkspaceReviewsParamsDto {
  @IsString()
  @Length(1, 50)
  reviewId!: string;
}
