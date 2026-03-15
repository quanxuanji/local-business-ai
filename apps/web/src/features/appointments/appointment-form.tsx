"use client";

import { useActionState } from "react";

import type { Locale } from "../../lib/i18n";
import type { FormState } from "./appointment-actions";

const STATUS_OPTIONS = [
  { value: "SCHEDULED", en: "Scheduled", zh: "已安排" },
  { value: "CONFIRMED", en: "Confirmed", zh: "已确认" },
];

type CustomerOption = { id: string; name: string };

type AppointmentFormProps = {
  locale: Locale;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  customers: CustomerOption[];
  defaultCustomerId?: string;
  submitLabel: string;
};

export function AppointmentForm({
  locale,
  action,
  customers,
  defaultCustomerId,
  submitLabel,
}: AppointmentFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine";

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultStart = now.toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          {locale === "zh" ? "客户" : "Customer"} *
        </label>
        <select
          name="customerId"
          required
          defaultValue={defaultCustomerId}
          className={inputCls}
        >
          <option value="">
            {locale === "zh" ? "请选择客户" : "Select a customer"}
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "开始时间" : "Starts at"} *
          </label>
          <input
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={defaultStart}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "结束时间" : "Ends at"}
          </label>
          <input
            name="endsAt"
            type="datetime-local"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "服务名称" : "Service name"}
          </label>
          <input
            name="serviceName"
            placeholder={
              locale === "zh" ? "如：深层清洁" : "e.g. Deep cleaning"
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "状态" : "Status"}
          </label>
          <select name="status" defaultValue="SCHEDULED" className={inputCls}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {locale === "zh" ? o.zh : o.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          {locale === "zh" ? "备注" : "Notes"}
        </label>
        <textarea name="notes" rows={3} className={inputCls} />
      </div>

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
            ? "保存中..."
            : "Saving..."
          : submitLabel}
      </button>
    </form>
  );
}
