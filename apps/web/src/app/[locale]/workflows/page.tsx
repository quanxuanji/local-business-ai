import { notFound } from "next/navigation";

import { ApiErrorBanner } from "../../../components/api-error-banner";
import { AppShell } from "../../../components/app-shell";
import { FeaturePanel } from "../../../components/feature-panel";
import { LoginRequiredBanner } from "../../../components/login-required-banner";
import { apiFetch } from "../../../lib/api-client";
import type { WorkflowRuleResponse } from "../../../lib/api-types";
import { getLocaleFromValue } from "../../../lib/i18n";
import { getSession } from "../../../lib/session";
import { createWorkflowRuleAction } from "../../../features/workflows/workflow-actions";
import { WorkflowRuleForm } from "../../../features/workflows/workflow-rule-form";
import { WorkflowRulesList } from "../../../features/workflows/workflow-rules-list";

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);
  if (!locale) notFound();

  const session = await getSession();
  let rules: WorkflowRuleResponse[] = [];
  let apiError = false;

  if (session) {
    try {
      rules = await apiFetch<WorkflowRuleResponse[]>(
        `/workspaces/${session.workspaceId}/workflow-rules`,
        { token: session.token },
      );
    } catch {
      apiError = true;
    }
  }

  const boundAction = createWorkflowRuleAction.bind(null, locale);

  return (
    <AppShell
      locale={locale}
      section="workflows"
      title={locale === "zh" ? "工作流管理" : "Workflow management"}
      description={
        locale === "zh"
          ? "创建和管理自动化工作流规则，定义触发条件和执行动作。"
          : "Create and manage automation rules with triggers and actions."
      }
    >
      {!session && <LoginRequiredBanner locale={locale} />}
      {apiError && <ApiErrorBanner locale={locale} />}

      <FeaturePanel
        title={locale === "zh" ? "新建规则" : "Create rule"}
        description={
          locale === "zh"
            ? "设置触发条件和执行动作来自动化运营流程。"
            : "Set up triggers and actions to automate operational workflows."
        }
      >
        <WorkflowRuleForm locale={locale} action={boundAction} />
      </FeaturePanel>

      <WorkflowRulesList locale={locale} rules={rules} />
    </AppShell>
  );
}
