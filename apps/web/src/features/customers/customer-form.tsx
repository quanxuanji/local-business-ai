"use client";

import { useActionState } from "react";

import type { Locale } from "../../lib/i18n";
import type { FormState } from "./customer-actions";

const STATUS_OPTIONS = [
  { value: "NEW_LEAD", en: "New Lead", zh: "新线索" },
  { value: "CONTACTED", en: "Contacted", zh: "已联系" },
  { value: "BOOKED", en: "Booked", zh: "已预约" },
  { value: "ACTIVE", en: "Active", zh: "活跃" },
  { value: "INACTIVE", en: "Inactive", zh: "沉默" },
  { value: "LOST", en: "Lost", zh: "已流失" },
];

const LANGUAGE_OPTIONS = [
  { value: "EN", en: "English", zh: "英文" },
  { value: "ZH", en: "Chinese", zh: "中文" },
];

type CustomerFormProps = {
  locale: Locale;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: string;
    preferredLanguage?: string;
    source?: string;
    notes?: string;
  };
  submitLabel: string;
};

export function CustomerForm({
  locale,
  action,
  defaultValues,
  submitLabel,
}: CustomerFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine";

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "名" : "First name"} *
          </label>
          <input
            name="firstName"
            required
            defaultValue={defaultValues?.firstName}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "姓" : "Last name"}
          </label>
          <input
            name="lastName"
            defaultValue={defaultValues?.lastName}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "邮箱" : "Email"}
          </label>
          <input
            name="email"
            type="email"
            defaultValue={defaultValues?.email}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "电话" : "Phone"}
          </label>
          <input
            name="phone"
            defaultValue={defaultValues?.phone}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "状态" : "Status"}
          </label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "NEW_LEAD"}
            className={inputCls}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {locale === "zh" ? o.zh : o.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "偏好语言" : "Preferred language"}
          </label>
          <select
            name="preferredLanguage"
            defaultValue={defaultValues?.preferredLanguage ?? "EN"}
            className={inputCls}
          >
            {LANGUAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {locale === "zh" ? o.zh : o.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          {locale === "zh" ? "来源" : "Source"}
        </label>
        <input
          name="source"
          defaultValue={defaultValues?.source}
          placeholder={locale === "zh" ? "如：网站表单、推荐" : "e.g. Website form, Referral"}
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          {locale === "zh" ? "备注" : "Notes"}
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes}
          className={inputCls}
        />
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
