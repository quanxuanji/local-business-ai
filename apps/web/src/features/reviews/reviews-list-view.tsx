import Link from "next/link";

import { FeaturePanel } from "../../components/feature-panel";
import { MetricCard } from "../../components/metric-card";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import type { ReviewResponse } from "../../lib/api-types";
import {
  getReviewStatusLabel,
  getReviewStatusTone,
} from "../../lib/status-labels";
import { formatDate } from "../operations/format";
import { submitReviewAction } from "./review-actions";
import { SubmitReviewForm } from "./submit-review-form";

type ReviewsListViewProps = {
  locale: Locale;
  reviews: ReviewResponse[];
};

function starString(rating: number | null): string {
  if (rating == null) return "-";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function ReviewsListView({ locale, reviews }: ReviewsListViewProps) {
  const requested = reviews.filter((r) => r.status === "REQUESTED").length;
  const submitted = reviews.filter((r) => r.status === "SUBMITTED").length;
  const avgRating =
    reviews.filter((r) => r.rating != null).length > 0
      ? (
          reviews.reduce((s, r) => s + (r.rating ?? 0), 0) /
          reviews.filter((r) => r.rating != null).length
        ).toFixed(1)
      : "-";

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={locale === "zh" ? "总评价" : "Total reviews"}
          value={String(reviews.length)}
          helper={locale === "zh" ? "包含已请求和已提交的评价。" : "Includes requested and submitted reviews."}
        />
        <MetricCard
          label={locale === "zh" ? "待处理" : "Pending"}
          value={String(requested)}
          helper={locale === "zh" ? "等待客户提交的评价请求。" : "Review requests awaiting customer submission."}
        />
        <MetricCard
          label={locale === "zh" ? "已提交" : "Submitted"}
          value={String(submitted)}
          helper={locale === "zh" ? "客户已完成的评价。" : "Completed reviews from customers."}
        />
        <MetricCard
          label={locale === "zh" ? "平均评分" : "Average rating"}
          value={avgRating}
          helper={locale === "zh" ? "基于所有已评分的评价。" : "Based on all rated reviews."}
        />
      </div>

      <FeaturePanel
        title={locale === "zh" ? "评价列表" : "Review list"}
        description={
          locale === "zh"
            ? `共 ${reviews.length} 条评价记录`
            : `${reviews.length} review(s)`
        }
      >
        {reviews.length === 0 ? (
          <p className="text-sm text-slate">
            {locale === "zh"
              ? "暂无评价记录。在客户详情页可以请求评价。"
              : "No reviews yet. You can request reviews from customer detail pages."}
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/${locale}/customers/${review.customerId}`}
                    className="text-sm font-semibold text-ink hover:text-pine"
                  >
                    {review.customer.fullName}
                  </Link>
                  <StatusBadge
                    tone={getReviewStatusTone(review.status)}
                  >
                    {getReviewStatusLabel(locale, review.status)}
                  </StatusBadge>
                  <span className="text-xs text-slate">{review.channel}</span>
                  <span className="ml-auto text-xs text-slate">
                    {formatDate(locale, review.createdAt)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-amber-600">
                    {starString(review.rating)}
                  </span>
                  {review.comment && (
                    <p className="text-sm text-slate">{review.comment}</p>
                  )}
                </div>
                {review.status === "REQUESTED" && (
                  <SubmitReviewForm
                    locale={locale}
                    reviewId={review.id}
                    onSubmit={submitReviewAction.bind(null, locale)}
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </FeaturePanel>
    </>
  );
}
