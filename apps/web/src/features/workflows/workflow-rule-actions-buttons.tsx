"use client";

import { useTransition } from "react";

type WorkflowRuleActionsButtonsProps = {
  locale: string;
  ruleId: string;
  isActive: boolean;
  onToggle: (ruleId: string, isActive: boolean) => Promise<unknown>;
  onDelete: (ruleId: string) => Promise<unknown>;
};

export function WorkflowRuleActionsButtons({
  locale,
  ruleId,
  isActive,
  onToggle,
  onDelete,
}: WorkflowRuleActionsButtonsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            onToggle(ruleId, !isActive);
          })
        }
        className={`rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${
          isActive
            ? "border-amber-300 text-amber-700 hover:bg-amber-50"
            : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        {isActive
          ? locale === "zh"
            ? "暂停"
            : "Pause"
          : locale === "zh"
            ? "启用"
            : "Enable"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const msg =
            locale === "zh"
              ? "确定要删除此规则吗？"
              : "Delete this rule?";
          if (confirm(msg)) {
            startTransition(() => {
              onDelete(ruleId);
            });
          }
        }}
        className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {locale === "zh" ? "删除" : "Delete"}
      </button>
    </div>
  );
}
