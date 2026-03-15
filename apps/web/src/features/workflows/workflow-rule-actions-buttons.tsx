"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { Locale } from "../../lib/i18n";
import type { FormState } from "./workflow-actions";
import { WorkflowRuleEditForm } from "./workflow-rule-edit-form";

type WorkflowRuleActionsButtonsProps = {
  locale: Locale;
  ruleId: string;
  isActive: boolean;
  defaultValues: { name: string; trigger: string; action: string };
  onToggle: (ruleId: string, isActive: boolean) => Promise<unknown>;
  onDelete: (ruleId: string) => Promise<unknown>;
  updateAction: (prev: FormState, formData: FormData) => Promise<FormState>;
};

export function WorkflowRuleActionsButtons({
  locale,
  ruleId,
  isActive,
  defaultValues,
  onToggle,
  onDelete,
  updateAction,
}: WorkflowRuleActionsButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => setEditing(!editing)}
          className="rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-medium text-ink hover:bg-stone-100 disabled:opacity-50"
        >
          {editing
            ? locale === "zh" ? "收起" : "Collapse"
            : locale === "zh" ? "编辑" : "Edit"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await onToggle(ruleId, !isActive);
              toast.success(locale === "zh" ? "规则状态已切换" : "Rule toggled");
            })
          }
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${
            isActive
              ? "border-amber-300 text-amber-700 hover:bg-amber-50"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {isActive
            ? locale === "zh" ? "暂停" : "Pause"
            : locale === "zh" ? "启用" : "Enable"}
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
              startTransition(async () => {
                await onDelete(ruleId);
                toast.success(locale === "zh" ? "规则已删除" : "Rule deleted");
              });
            }
          }}
          className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {locale === "zh" ? "删除" : "Delete"}
        </button>
      </div>
      {editing && (
        <WorkflowRuleEditForm
          locale={locale}
          ruleId={ruleId}
          defaultValues={defaultValues}
          updateAction={updateAction}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
