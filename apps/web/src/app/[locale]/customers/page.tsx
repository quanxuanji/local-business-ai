import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiErrorBanner } from "../../../components/api-error-banner";
import { AppShell } from "../../../components/app-shell";
import { CustomersListView } from "../../../features/customers/customer-list";
import { getCustomersSnapshot } from "../../../features/customers/data";
import { getLocaleFromValue } from "../../../lib/i18n";

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) {
    notFound();
  }

  const snapshot = await getCustomersSnapshot(locale);

  return (
    <AppShell
      locale={locale}
      section="customers"
      title={locale === "zh" ? "客户列表" : "Customer CRM"}
      description={
        locale === "zh"
          ? "管理线索和客户，查看客户状态和负责人分配情况。"
          : "Manage leads and customers, view status and owner assignments."
      }
    >
      {snapshot.apiError && <ApiErrorBanner locale={locale} />}

      <div className="flex justify-end">
        <Link
          href={`/${locale}/customers/new`}
          className="inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink/90"
        >
          {locale === "zh" ? "+ 新建客户" : "+ New customer"}
        </Link>
      </div>

      <CustomersListView locale={locale} snapshot={snapshot} />
    </AppShell>
  );
}
