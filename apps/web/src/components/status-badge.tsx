import type { ReactNode } from "react";

type StatusBadgeTone = "neutral" | "info" | "success" | "warning";

const toneClassName: Record<StatusBadgeTone, string> = {
  neutral: "bg-stone-200 text-stone-700",
  info: "bg-sky text-ink",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
};

type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
};

export function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}
