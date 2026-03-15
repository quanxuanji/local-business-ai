"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "./actions";

type LoginFormProps = {
  locale: string;
};

export function LoginForm({ locale }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label
          htmlFor="workspaceSlug"
          className="mb-1 block text-sm font-medium text-ink"
        >
          {locale === "zh" ? "工作空间 Slug" : "Workspace slug"}
        </label>
        <input
          id="workspaceSlug"
          name="workspaceSlug"
          type="text"
          required
          defaultValue="downtown-dental"
          placeholder="downtown-dental"
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-ink"
        >
          {locale === "zh" ? "邮箱" : "Email"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="mia@example.com"
          placeholder="mia@example.com"
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-ink"
        >
          {locale === "zh" ? "姓名（可选）" : "Name (optional)"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder={locale === "zh" ? "输入姓名" : "Your name"}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
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
        className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isPending
          ? locale === "zh"
            ? "登录中..."
            : "Signing in..."
          : locale === "zh"
            ? "登录"
            : "Sign in"}
      </button>
    </form>
  );
}
