import Link from "next/link";
import { notFound } from "next/navigation";

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
          ? "Phase 1 先把线索和客户统一放进同一个列表，后续再接入真实筛选、分页和 CRM 查询能力。"
          : "Phase 1 keeps leads and customers in one practical roster, with room to add real filtering and CRM queries later."
      }
    >
      <CustomersListView locale={locale} snapshot={snapshot} />

      <Link
        href={`/${locale}/customers/emma-chen`}
        className="inline-flex rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
      >
        {locale === "zh" ? "打开示例客户" : "Open sample customer"}
      </Link>
    </AppShell>
  );
}
