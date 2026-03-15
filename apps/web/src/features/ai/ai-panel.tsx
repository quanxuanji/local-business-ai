"use client";

import { useState, useTransition } from "react";

type AiPanelProps = {
  locale: string;
  customerId: string;
  customerName: string;
  notes: string;
  status: string;
  onSummary: (
    customerId: string,
    customerName: string,
    notes: string,
    status: string,
  ) => Promise<{ text?: string; error?: string }>;
  onNextAction: (
    customerId: string,
    customerName: string,
    status: string,
    context: string,
  ) => Promise<{ text?: string; error?: string }>;
};

export function AiPanel({
  locale,
  customerId,
  customerName,
  notes,
  status,
  onSummary,
  onNextAction,
}: AiPanelProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSummary = () => {
    setError(null);
    startTransition(async () => {
      const result = await onSummary(customerId, customerName, notes, status);
      if (result.error) setError(result.error);
      else setSummary(result.text ?? null);
    });
  };

  const handleNextAction = () => {
    setError(null);
    startTransition(async () => {
      const result = await onNextAction(
        customerId,
        customerName,
        status,
        notes,
      );
      if (result.error) setError(result.error);
      else setSuggestion(result.text ?? null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSummary}
          className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50"
        >
          {isPending
            ? locale === "zh"
              ? "AI 思考中..."
              : "AI thinking..."
            : locale === "zh"
              ? "AI 客户摘要"
              : "AI summary"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleNextAction}
          className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50"
        >
          {isPending
            ? locale === "zh"
              ? "AI 思考中..."
              : "AI thinking..."
            : locale === "zh"
              ? "AI 建议下一步"
              : "AI next action"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {summary && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <h4 className="text-sm font-semibold text-violet-900">
            {locale === "zh" ? "AI 客户摘要" : "AI Customer Summary"}
          </h4>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-violet-800">
            {summary}
          </p>
          <p className="mt-2 text-xs text-violet-500">
            {locale === "zh"
              ? "⚠️ AI 生成内容，仅供参考。请人工审核后再使用。"
              : "⚠️ AI-generated content. Please review before use."}
          </p>
        </div>
      )}

      {suggestion && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <h4 className="text-sm font-semibold text-violet-900">
            {locale === "zh" ? "AI 建议下一步" : "AI Suggested Next Action"}
          </h4>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-violet-800">
            {suggestion}
          </p>
          <p className="mt-2 text-xs text-violet-500">
            {locale === "zh"
              ? "⚠️ AI 生成内容，仅供参考。请人工审核后再使用。"
              : "⚠️ AI-generated content. Please review before use."}
          </p>
        </div>
      )}
    </div>
  );
}
