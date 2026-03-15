"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type SendMessageButtonProps = {
  locale: string;
  onSend: () => Promise<unknown>;
};

export function SendMessageButton({ locale, onSend }: SendMessageButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const msg =
          locale === "zh"
            ? "确认发送此消息？"
            : "Confirm sending this message?";
        if (confirm(msg)) {
          startTransition(async () => {
            await onSend();
            toast.success(locale === "zh" ? "消息已发送！" : "Message sent!");
          });
        }
      }}
      className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
    >
      {isPending
        ? locale === "zh"
          ? "发送中..."
          : "Sending..."
        : locale === "zh"
          ? "确认发送"
          : "Send now"}
    </button>
  );
}
