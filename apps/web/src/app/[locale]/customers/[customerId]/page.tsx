import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../components/app-shell";
import { FeaturePanel } from "../../../../components/feature-panel";
import { CustomerDetailView } from "../../../../features/customers/customer-detail-view";
import { deleteCustomerAction } from "../../../../features/customers/customer-actions";
import { DeleteCustomerButton } from "../../../../features/customers/delete-customer-button";
import { getCustomerDetail } from "../../../../features/customers/data";
import { apiFetch } from "../../../../lib/api-client";
import type { MessageResponse } from "../../../../lib/api-types";
import { getLocaleFromValue } from "../../../../lib/i18n";
import { getSession } from "../../../../lib/session";
import { createMessageAction } from "../../../../features/messaging/message-actions";
import { MessageComposeForm } from "../../../../features/messaging/message-compose-form";
import { MessageListPanel } from "../../../../features/messaging/message-list-panel";
import { requestReviewAction } from "../../../../features/reviews/review-actions";
import { RequestReviewButton } from "../../../../features/reviews/request-review-button";
import {
  getCustomerSummaryAction,
  getNextActionAction,
} from "../../../../features/ai/ai-actions";
import { AiPanel } from "../../../../features/ai/ai-panel";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; customerId: string }>;
}) {
  const resolvedParams = await params;
  const locale = getLocaleFromValue(resolvedParams.locale);

  if (!locale) {
    notFound();
  }

  const customer = await getCustomerDetail(resolvedParams.customerId, locale);

  if (!customer) {
    notFound();
  }

  const boundDelete = deleteCustomerAction.bind(
    null,
    locale,
    resolvedParams.customerId,
  );

  const session = await getSession();
  let messages: MessageResponse[] = [];
  if (session) {
    try {
      messages = await apiFetch<MessageResponse[]>(
        `/workspaces/${session.workspaceId}/messages`,
        {
          token: session.token,
          params: { customerId: resolvedParams.customerId },
        },
      );
    } catch {
      /* messages unavailable */
    }
  }

  const boundCreateMessage = createMessageAction.bind(
    null,
    locale,
    resolvedParams.customerId,
  );

  return (
    <AppShell
      locale={locale}
      section="customers"
      title={
        locale === "zh"
          ? `客户: ${customer.name}`
          : `Customer: ${customer.name}`
      }
      description={
        locale === "zh"
          ? "查看客户详情、预约记录和时间线。"
          : "View customer details, appointments and timeline."
      }
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${locale}/customers/${resolvedParams.customerId}/edit`}
          className="inline-flex rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink/90"
        >
          {locale === "zh" ? "编辑客户" : "Edit customer"}
        </Link>
        <Link
          href={`/${locale}/appointments/new?customerId=${resolvedParams.customerId}`}
          className="inline-flex rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-mist"
        >
          {locale === "zh" ? "新建预约" : "New appointment"}
        </Link>
        <RequestReviewButton
          locale={locale}
          label={locale === "zh" ? "请求评价" : "Request review"}
          onRequest={requestReviewAction.bind(
            null,
            locale,
            resolvedParams.customerId,
            "SMS",
          )}
        />
        <DeleteCustomerButton
          locale={locale}
          label={locale === "zh" ? "删除客户" : "Delete customer"}
          onDelete={boundDelete}
        />
      </div>

      <CustomerDetailView locale={locale} customer={customer} />

      <FeaturePanel
        title={locale === "zh" ? "AI 助手" : "AI Assistant"}
        description={
          locale === "zh"
            ? "使用 AI 生成客户摘要和下一步行动建议。所有 AI 输出需人工确认。"
            : "Use AI to generate customer summaries and next-action suggestions. All AI output requires human review."
        }
      >
        <AiPanel
          locale={locale}
          customerId={resolvedParams.customerId}
          customerName={customer.name}
          notes={customer.summary}
          status={customer.stage}
          onSummary={getCustomerSummaryAction}
          onNextAction={getNextActionAction}
        />
      </FeaturePanel>

      <FeaturePanel
        title={locale === "zh" ? "发送消息" : "Send message"}
        description={
          locale === "zh"
            ? "给客户发送 SMS 或 Email 消息（先创建草稿，确认后发送）。"
            : "Send an SMS or Email to this customer (creates a draft first, then confirm to send)."
        }
      >
        <MessageComposeForm locale={locale} action={boundCreateMessage} />
      </FeaturePanel>

      <MessageListPanel locale={locale} messages={messages} />
    </AppShell>
  );
}
