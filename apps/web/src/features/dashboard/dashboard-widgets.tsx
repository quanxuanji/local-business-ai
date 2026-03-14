import { FeaturePanel } from "../../components/feature-panel";
import { MetricCard } from "../../components/metric-card";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import type { DashboardSnapshot } from "./data";

type DashboardWidgetsProps = {
  locale: Locale;
  snapshot: DashboardSnapshot;
};

export function DashboardWidgets({
  locale,
  snapshot,
}: DashboardWidgetsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <FeaturePanel
          title={locale === "zh" ? "今日执行队列" : "Today's execution queue"}
          description={
            locale === "zh"
              ? "所有动作仍然保持人工确认，这里只展示可以执行的运营事项。"
              : "Every action stays operator-reviewed; this panel only surfaces ready work."
          }
        >
          <div className="space-y-4">
            {snapshot.queue.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <StatusBadge tone={item.tone}>
                    {locale === "zh" ? "需人工处理" : "Operator action"}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate">{item.detail}</p>
              </article>
            ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "客户阶段分布" : "Customer stage mix"}
          description={
            locale === "zh"
              ? "先用占位数据稳定仪表盘结构，后续直接接入真实读模型。"
              : "The widget shape is production-ready while the backend read model catches up."
          }
        >
          <div className="space-y-3">
            {snapshot.stages.map((item) => (
              <div
                key={item.stage}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="text-lg font-semibold text-ink">{item.count}</p>
              </div>
            ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "AI 助手建议" : "Assistive AI inbox"}
          description={
            locale === "zh"
              ? "这里只展示建议，不执行自动回复，也不引入复杂自主逻辑。"
              : "Suggestions stay human-gated and avoid any autonomous behavior."
          }
        >
          <div className="space-y-4">
            {snapshot.insights.map((insight) => (
              <article
                key={insight.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-ink">
                    {insight.customerName}
                  </h3>
                  <StatusBadge tone="info">
                    {locale === "zh" ? "建议" : "Suggested"}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate">
                  {insight.summary}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">
                  {insight.actionLabel}
                </p>
              </article>
            ))}
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={locale === "zh" ? "后端接入点" : "Backend handoff map"}
          description={
            locale === "zh"
              ? "明确标出后端完成后应替换的占位数据来源。"
              : "These are the explicit seams where placeholder data should be swapped out."
          }
        >
          <div className="space-y-4">
            {snapshot.dependencies.map((dependency) => (
              <article
                key={dependency.id}
                className="rounded-xl border border-dashed border-stone-300 bg-white p-4"
              >
                <p className="text-sm font-semibold text-ink">{dependency.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate">
                  {dependency.detail}
                </p>
              </article>
            ))}
          </div>
        </FeaturePanel>
      </div>
    </>
  );
}
