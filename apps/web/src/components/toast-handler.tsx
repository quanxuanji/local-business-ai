"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const messages: Record<string, Record<string, string>> = {
  en: {
    "customer-created": "Customer created successfully!",
    "customer-updated": "Customer updated successfully!",
    "customer-deleted": "Customer deleted.",
    "appointment-created": "Appointment created successfully!",
    "appointment-updated": "Appointment status updated.",
    "appointment-deleted": "Appointment deleted.",
    "review-requested": "Review request sent!",
    "review-submitted": "Review submitted!",
    "workflow-created": "Workflow rule created!",
    "workflow-updated": "Workflow rule updated!",
    "workflow-toggled": "Workflow rule toggled.",
    "workflow-deleted": "Workflow rule deleted.",
    "message-created": "Message draft created!",
    "message-sent": "Message sent!",
  },
  zh: {
    "customer-created": "客户创建成功！",
    "customer-updated": "客户更新成功！",
    "customer-deleted": "客户已删除。",
    "appointment-created": "预约创建成功！",
    "appointment-updated": "预约状态已更新。",
    "appointment-deleted": "预约已删除。",
    "review-requested": "评价请求已发送！",
    "review-submitted": "评价已提交！",
    "workflow-created": "工作流规则已创建！",
    "workflow-updated": "工作流规则已更新！",
    "workflow-toggled": "工作流规则状态已切换。",
    "workflow-deleted": "工作流规则已删除。",
    "message-created": "消息草稿已创建！",
    "message-sent": "消息已发送！",
  },
};

export function ToastHandler({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    if (!toastKey) return;

    const lang = locale === "zh" ? "zh" : "en";
    const msg = messages[lang]?.[toastKey];

    if (msg) {
      toast.success(msg);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [searchParams, locale, router, pathname]);

  return null;
}
