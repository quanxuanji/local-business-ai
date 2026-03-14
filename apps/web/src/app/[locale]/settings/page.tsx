import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { FeaturePanel } from "../../../components/feature-panel";
import { getLocaleFromValue } from "../../../lib/i18n";

export default async function SettingsPage({
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
      section="settings"
      title="Workspace settings"
      description="Configuration for messaging providers, AI keys, localization defaults, and future Redis or BullMQ wiring can live here without expanding the MVP module list."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <FeaturePanel
          title="Workspace profile"
          description="Business name, timezone, locale defaults, and operator preferences belong in this section."
        />
        <FeaturePanel
          title="Provider placeholders"
          description="Twilio, Resend, OpenAI, Anthropic, Redis, and BullMQ settings are scaffolded for future integration only."
        />
      </div>
    </AppShell>
  );
}
