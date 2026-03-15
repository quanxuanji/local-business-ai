import { FeaturePanel } from "../../components/feature-panel";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import type { MessageResponse } from "../../lib/api-types";
import { sendMessageAction } from "./message-actions";
import { SendMessageButton } from "./send-message-button";

type MessageListPanelProps = {
  locale: Locale;
  messages: MessageResponse[];
};

export function MessageListPanel({ locale, messages }: MessageListPanelProps) {
  if (messages.length === 0) {
    return (
      <FeaturePanel
        title={locale === "zh" ? "消息记录" : "Messages"}
        description={
          locale === "zh"
            ? "暂无消息记录。"
            : "No messages yet."
        }
      >
        <p className="text-sm text-slate">
          {locale === "zh"
            ? "使用上方表单创建消息草稿。"
            : "Use the form above to create a message draft."}
        </p>
      </FeaturePanel>
    );
  }

  return (
    <FeaturePanel
      title={locale === "zh" ? "消息记录" : "Messages"}
      description={
        locale === "zh"
          ? `共 ${messages.length} 条消息`
          : `${messages.length} message(s)`
      }
    >
      <div className="space-y-3">
        {messages.map((msg) => (
          <article
            key={msg.id}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                tone={
                  msg.status === "SENT"
                    ? "success"
                    : msg.status === "FAILED"
                      ? "warning"
                      : "neutral"
                }
              >
                {msg.status}
              </StatusBadge>
              <span className="text-xs text-slate">{msg.channel}</span>
              {msg.subject && (
                <span className="text-xs font-medium text-ink">
                  {msg.subject}
                </span>
              )}
              <span className="ml-auto text-xs text-slate">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {msg.body}
            </p>
            {msg.status === "DRAFT" && (
              <div className="mt-3">
                <SendMessageButton
                  locale={locale}
                  onSend={sendMessageAction.bind(null, locale, msg.id)}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </FeaturePanel>
  );
}
