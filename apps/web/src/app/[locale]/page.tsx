import { notFound, redirect } from "next/navigation";

import { getLocaleFromValue } from "../../lib/i18n";

export default async function LocaleIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) {
    notFound();
  }

  redirect(`/${locale}/dashboard`);
}
