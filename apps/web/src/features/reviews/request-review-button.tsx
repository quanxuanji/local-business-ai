"use client";

import { useTransition } from "react";

type RequestReviewButtonProps = {
  locale: string;
  label: string;
  onRequest: () => Promise<unknown>;
};

export function RequestReviewButton({
  locale,
  label,
  onRequest,
}: RequestReviewButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          onRequest();
        })
      }
      className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
    >
      {isPending ? (locale === "zh" ? "请求中..." : "Requesting...") : label}
    </button>
  );
}
