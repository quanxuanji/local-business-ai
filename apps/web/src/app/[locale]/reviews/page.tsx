import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { FeaturePanel } from "../../../components/feature-panel";
import { getLocaleFromValue } from "../../../lib/i18n";

export default async function ReviewsPage({
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
      section="reviews"
      title="Review collection"
      description="Review requests stay lightweight in the MVP: send request, track response status, and connect the result back to the customer record."
    >
      <FeaturePanel
        title="Request queue"
        description="Operators will review pending review requests here before outbound SMS or email is dispatched."
      />
      <FeaturePanel
        title="Response tracking"
        description="Submitted ratings, comments, and external review links will roll up here once the reviews module is implemented."
      />
    </AppShell>
  );
}
