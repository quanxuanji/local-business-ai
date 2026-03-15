"use client";

import { useTransition } from "react";

type AppointmentStatusButtonsProps = {
  locale: string;
  appointmentId: string;
  currentStatus: string;
  onStatusChange: (appointmentId: string, status: string) => Promise<unknown>;
  onDelete: (appointmentId: string) => Promise<unknown>;
};

const actions: Array<{
  status: string;
  fromStatuses: string[];
  en: string;
  zh: string;
  cls: string;
}> = [
  {
    status: "CONFIRMED",
    fromStatuses: ["pending", "SCHEDULED"],
    en: "Confirm",
    zh: "确认",
    cls: "border-blue-300 text-blue-700 hover:bg-blue-50",
  },
  {
    status: "COMPLETED",
    fromStatuses: ["confirmed", "CONFIRMED"],
    en: "Complete",
    zh: "完成",
    cls: "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
  },
  {
    status: "CANCELED",
    fromStatuses: ["pending", "confirmed", "SCHEDULED", "CONFIRMED"],
    en: "Cancel",
    zh: "取消",
    cls: "border-red-300 text-red-700 hover:bg-red-50",
  },
];

export function AppointmentStatusButtons({
  locale,
  appointmentId,
  currentStatus,
  onStatusChange,
  onDelete,
}: AppointmentStatusButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const available = actions.filter((a) =>
    a.fromStatuses.includes(currentStatus),
  );

  if (available.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {available.map((a) => (
        <button
          key={a.status}
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              onStatusChange(appointmentId, a.status);
            })
          }
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${a.cls}`}
        >
          {locale === "zh" ? a.zh : a.en}
        </button>
      ))}
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          const msg =
            locale === "zh"
              ? "确定要删除此预约吗？"
              : "Delete this appointment?";
          if (confirm(msg)) {
            startTransition(() => {
              onDelete(appointmentId);
            });
          }
        }}
        className="rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-medium text-slate hover:bg-stone-100 disabled:opacity-50"
      >
        {locale === "zh" ? "删除" : "Delete"}
      </button>
    </div>
  );
}
