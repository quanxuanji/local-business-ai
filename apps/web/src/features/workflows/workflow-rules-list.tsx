import { FeaturePanel } from "../../components/feature-panel";
import { StatusBadge } from "../../components/status-badge";
import type { Locale } from "../../lib/i18n";
import type { WorkflowRuleResponse } from "../../lib/api-types";
import {
  toggleWorkflowRuleAction,
  deleteWorkflowRuleAction,
} from "./workflow-actions";
import { WorkflowRuleActionsButtons } from "./workflow-rule-actions-buttons";

type WorkflowRulesListProps = {
  locale: Locale;
  rules: WorkflowRuleResponse[];
};

const triggerLabels: Record<string, Record<string, string>> = {
  en: {
    LEAD_CREATED: "Lead created",
    LEAD_NOT_CONTACTED_24H: "Lead not contacted (24h)",
    APPOINTMENT_BOOKED: "Appointment booked",
    APPOINTMENT_REMINDER: "Appointment reminder",
    APPOINTMENT_COMPLETED: "Appointment completed",
    CUSTOMER_INACTIVE_30D: "Customer inactive (30d)",
  },
  zh: {
    LEAD_CREATED: "新线索创建",
    LEAD_NOT_CONTACTED_24H: "线索24小时未联系",
    APPOINTMENT_BOOKED: "预约已创建",
    APPOINTMENT_REMINDER: "预约提醒",
    APPOINTMENT_COMPLETED: "预约已完成",
    CUSTOMER_INACTIVE_30D: "客户30天未活跃",
  },
};

const actionLabels: Record<string, Record<string, string>> = {
  en: {
    SEND_MESSAGE: "Send message",
    CREATE_TASK: "Create task",
    UPDATE_CUSTOMER_STATUS: "Update customer status",
    ASSIGN_OWNER: "Assign owner",
    REQUEST_REVIEW: "Request review",
  },
  zh: {
    SEND_MESSAGE: "发送消息",
    CREATE_TASK: "创建任务",
    UPDATE_CUSTOMER_STATUS: "更新客户状态",
    ASSIGN_OWNER: "分配负责人",
    REQUEST_REVIEW: "请求评价",
  },
};

export function WorkflowRulesList({
  locale,
  rules,
}: WorkflowRulesListProps) {
  return (
    <FeaturePanel
      title={locale === "zh" ? "工作流规则" : "Workflow rules"}
      description={
        locale === "zh"
          ? `共 ${rules.length} 条规则`
          : `${rules.length} rule(s)`
      }
    >
      {rules.length === 0 ? (
        <p className="text-sm text-slate">
          {locale === "zh"
            ? "暂无工作流规则。使用上方表单创建。"
            : "No workflow rules yet. Use the form above to create one."}
        </p>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-ink">{rule.name}</h3>
                <StatusBadge tone={rule.isActive ? "success" : "neutral"}>
                  {rule.isActive
                    ? locale === "zh"
                      ? "启用"
                      : "Active"
                    : locale === "zh"
                      ? "已暂停"
                      : "Paused"}
                </StatusBadge>
                <span className="ml-auto text-xs text-slate">
                  {new Date(rule.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate">
                <span>
                  {locale === "zh" ? "触发: " : "Trigger: "}
                  {triggerLabels[locale]?.[rule.trigger] ?? rule.trigger}
                </span>
                <span>→</span>
                <span>
                  {locale === "zh" ? "动作: " : "Action: "}
                  {actionLabels[locale]?.[rule.action] ?? rule.action}
                </span>
              </div>
              <div className="mt-3">
                <WorkflowRuleActionsButtons
                  locale={locale}
                  ruleId={rule.id}
                  isActive={rule.isActive}
                  onToggle={toggleWorkflowRuleAction.bind(null, locale)}
                  onDelete={deleteWorkflowRuleAction.bind(null, locale)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </FeaturePanel>
  );
}
