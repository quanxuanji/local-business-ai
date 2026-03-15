"use client";

import { useTransition } from "react";

type DeleteCustomerButtonProps = {
  locale: string;
  label: string;
  onDelete: () => Promise<unknown>;
};

export function DeleteCustomerButton({
  locale,
  label,
  onDelete,
}: DeleteCustomerButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const msg =
          locale === "zh"
            ? "确定要删除此客户吗？此操作不可撤销。"
            : "Are you sure you want to delete this customer? This cannot be undone.";
        if (confirm(msg)) {
          startTransition(() => {
            onDelete();
          });
        }
      }}
      className="rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? (locale === "zh" ? "删除中..." : "Deleting...") : label}
    </button>
  );
}
