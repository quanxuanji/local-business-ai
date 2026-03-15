"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

type SubmitReviewFormProps = {
  locale: string;
  reviewId: string;
  onSubmit: (
    reviewId: string,
    rating: number,
    comment: string,
  ) => Promise<{ error?: string; success?: boolean }>;
};

export function SubmitReviewForm({
  locale,
  reviewId,
  onSubmit,
}: SubmitReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (done) {
    return (
      <p className="text-xs font-medium text-emerald-600">
        {locale === "zh" ? "已提交！" : "Submitted!"}
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-stone-200 bg-mist/50 p-3">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-ink">
          {locale === "zh" ? "评分" : "Rating"}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-lg ${star <= rating ? "text-amber-500" : "text-stone-300"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={locale === "zh" ? "评价内容（可选）" : "Comment (optional)"}
        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-ink placeholder:text-slate focus:border-pine focus:outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await onSubmit(reviewId, rating, comment);
            if (result.error) {
              setError(result.error);
              toast.error(result.error);
            } else {
              setDone(true);
              toast.success(locale === "zh" ? "评价已提交！" : "Review submitted!");
            }
          });
        }}
        className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        {isPending
          ? locale === "zh"
            ? "提交中..."
            : "Submitting..."
          : locale === "zh"
            ? "提交评价"
            : "Submit review"}
      </button>
    </div>
  );
}
