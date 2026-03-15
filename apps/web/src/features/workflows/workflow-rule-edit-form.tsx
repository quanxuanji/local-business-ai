"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import type { Locale } from "../../lib/i18n";
import type { FormState } from "./workflow-actions";

const TRIGGERS = [
  { value: "LEAD_CREATED", en: "Lead created", zh: "新线索创建" },
  { value: "LEAD_NOT_CONTACTED_24H", en: "Lead not contacted (24h)", zh: "线索24小时未联系" },
  { value: "APPOINTMENT_BOOKED", en: "Appointment booked", zh: "预约已创建" },
  { value: "APPOINTMENT_REMINDER", en: "Appointment reminder", zh: "预约提醒" },
  { value: "APPOINTMENT_COMPLETED", en: "Appointment completed", zh: "预约已完成" },
  { value: "CUSTOMER_INACTIVE_30D", en: "Customer inactive (30d)", zh: "客户30天未活跃" },
];

const ACTIONS = [
  { value: "SEND_MESSAGE", en: "Send message", zh: "发送消息" },
  { value: "CREATE_TASK", en: "Create task", zh: "创建任务" },
  { value: "UPDATE_CUSTOMER_STATUS", en: "Update customer status", zh: "更新客户状态" },
  { value: "ASSIGN_OWNER", en: "Assign owner", zh: "分配负责人" },
  { value: "REQUEST_REVIEW", en: "Request review", zh: "请求评价" },
];

type WorkflowRuleEditFormProps = {
  locale: Locale;
  ruleId: string;
  defaultValues: { name: string; trigger: string; action: string };
  updateAction: (prev: FormState, formData: FormData) => Promise<FormState>;
  onClose: () => void;
};

export function WorkflowRuleEditForm({
  locale,
  defaultValues,
  updateAction,
  onClose,
}: WorkflowRuleEditFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateAction,
    {},
  );

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-ink focus:border-pine focus:outline-none";

  const toastFired = useRef(false);
  useEffect(() => {
    if (state.success && !toastFired.current) {
      toastFired.current = true;
      toast.success(locale === "zh" ? "规则已更新！" : "Rule updated!");
    }
  }, [state.success, locale]);

  if (state.success) {
    return (
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
        {locale === "zh" ? "规则已更新！" : "Rule updated!"}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3 rounded-lg border border-stone-200 bg-mist/50 p-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-ink">
          {locale === "zh" ? "规则名称" : "Rule name"}
        </label>
        <input name="name" defaultValue={defaultValues.name} className={inputCls} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink">
            {locale === "zh" ? "触发器" : "Trigger"}
          </label>
          <select name="trigger" defaultValue={defaultValues.trigger} className={inputCls}>
            {TRIGGERS.map((t) => (
              <option key={t.value} value={t.value}>
                {locale === "zh" ? t.zh : t.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink">
            {locale === "zh" ? "动作" : "Action"}
          </label>
          <select name="action" defaultValue={defaultValues.action} className={inputCls}>
            {ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {locale === "zh" ? a.zh : a.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.error && (
        <p className="text-xs text-red-600">{state.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isPending
            ? locale === "zh" ? "保存中..." : "Saving..."
            : locale === "zh" ? "保存" : "Save"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-slate"
        >
          {locale === "zh" ? "取消" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
