import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { FeaturePanel } from "../../../components/feature-panel";
import { getLocaleFromValue } from "../../../lib/i18n";

const triggers = [
  "lead_created",
  "lead_not_contacted_24h",
  "appointment_booked",
  "appointment_reminder",
  "appointment_completed",
  "customer_inactive_30d",
];

const actions = [
  "send_message",
  "create_task",
  "update_customer_status",
  "assign_owner",
  "request_review",
];

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) {
    notFound();
  }

  return (
    <AppShell
      locale={locale}
      section="workflows"
      title="Workflow rules"
      description="The MVP workflow engine is limited to the trigger and action set defined in the README, keeping automation simple and operator-controlled."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <FeaturePanel
          title="Supported triggers"
          description="Rules will be configured against these event types in the initial workflow engine."
        >
          <ul className="space-y-2 text-sm text-slate">
            {triggers.map((trigger) => (
              <li key={trigger} className="rounded-xl bg-white px-4 py-3">
                {trigger}
              </li>
            ))}
          </ul>
        </FeaturePanel>
        <FeaturePanel
          title="Supported actions"
          description="Actions stay bounded to outbound messaging, operational tasks, and customer-state updates."
        >
          <ul className="space-y-2 text-sm text-slate">
            {actions.map((action) => (
              <li key={action} className="rounded-xl bg-white px-4 py-3">
                {action}
              </li>
            ))}
          </ul>
        </FeaturePanel>
      </div>
    </AppShell>
  );
}
