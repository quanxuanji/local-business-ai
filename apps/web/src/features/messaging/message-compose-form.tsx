"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import type { Locale } from "../../lib/i18n";
import type { FormState } from "./message-actions";

type MessageComposeFormProps = {
  locale: Locale;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

export function MessageComposeForm({ locale, action }: MessageComposeFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine";

  const toastFired = useRef(false);
  useEffect(() => {
    if (state.success && !toastFired.current) {
      toastFired.current = true;
      toast.success(locale === "zh" ? "消息草稿已创建！" : "Message draft created!");
    }
  }, [state.success, locale]);

  if (state.success) {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        {locale === "zh" ? "消息草稿已创建！" : "Message draft created!"}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "渠道" : "Channel"}
          </label>
          <select name="channel" defaultValue="SMS" className={inputCls}>
            <option value="SMS">SMS</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            {locale === "zh" ? "主题" : "Subject"}
          </label>
          <input
            name="subject"
            placeholder={locale === "zh" ? "仅邮件需要" : "Email only"}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          {locale === "zh" ? "消息内容" : "Message body"} *
        </label>
        <textarea
          name="body"
          required
          rows={4}
          placeholder={
            locale === "zh"
              ? "输入要发送给客户的消息..."
              : "Type the message to send to the customer..."
          }
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
            ? "创建中..."
            : "Creating..."
          : locale === "zh"
            ? "创建草稿"
            : "Create draft"}
      </button>
    </form>
  );
}
