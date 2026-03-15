import { notFound } from "next/navigation";

import { AppShell } from "../../../components/app-shell";
import { LoginRequiredBanner } from "../../../components/login-required-banner";
import { apiFetch } from "../../../lib/api-client";
import type { ReviewResponse } from "../../../lib/api-types";
import { getLocaleFromValue } from "../../../lib/i18n";
import { getSession } from "../../../lib/session";
import { ReviewsListView } from "../../../features/reviews/reviews-list-view";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);
  if (!locale) notFound();

  const session = await getSession();
  let reviews: ReviewResponse[] = [];

  if (session) {
    try {
      reviews = await apiFetch<ReviewResponse[]>(
        `/workspaces/${session.workspaceId}/reviews`,
        { token: session.token },
      );
    } catch {
      /* reviews unavailable */
    }
  }

  return (
    <AppShell
      locale={locale}
      section="reviews"
      title={locale === "zh" ? "评价管理" : "Reviews"}
      description={
        locale === "zh"
          ? "查看和管理客户评价，跟踪评价请求状态。"
          : "View and manage customer reviews, track review request status."
      }
    >
      {!session && <LoginRequiredBanner locale={locale} />}
      <ReviewsListView locale={locale} reviews={reviews} />
    </AppShell>
  );
}
