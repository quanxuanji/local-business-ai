"use client";

import { useActionState } from "react";

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

type WorkflowRuleFormProps = {
  locale: Locale;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

export function WorkflowRuleForm({ locale, action }: WorkflowRuleFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine";

  if (state.success) {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        {locale === "zh" ? "工作流规则已创建！" : "Workflow rule created!"}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          {locale === "zh" ? "规则名称" : "Rule name"} *
        </label>
        <input
          name="name"
          required
          placeholder={
            locale === "zh"
              ? "如：新客户欢迎短信"
              : "e.g. Welcome SMS for new leads"
          }
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "触发器" : "Trigger"} *
          </label>
          <select name="trigger" required className={inputCls}>
            {TRIGGERS.map((t) => (
              <option key={t.value} value={t.value}>
                {locale === "zh" ? t.zh : t.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "动作" : "Action"} *
          </label>
          <select name="action" required className={inputCls}>
            {ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {locale === "zh" ? a.zh : a.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input type="hidden" name="isActive" value="true" />

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isPending
          ? locale === "zh"
            ? "创建中..."
            : "Creating..."
          : locale === "zh"
            ? "创建规则"
            : "Create rule"}
      </button>
    </form>
  );
}
