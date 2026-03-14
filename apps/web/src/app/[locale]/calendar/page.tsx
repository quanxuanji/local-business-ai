import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { FeaturePanel } from "../../../components/feature-panel";
import { getLocaleFromValue } from "../../../lib/i18n";

export default async function CalendarPage({
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
      section="calendar"
      title="Calendar"
      description="This page reserves space for a scheduling view layered on top of appointments, without adding a separate scheduling service."
    >
      <FeaturePanel
        title="Daily and weekly views"
        description="Calendar rendering, timezone-aware slots, and drag-and-drop rescheduling can grow here after core booking flows are in place."
      />
    </AppShell>
  );
}
