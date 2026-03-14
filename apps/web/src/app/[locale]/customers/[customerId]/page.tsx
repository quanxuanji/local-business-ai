import { notFound } from "next/navigation";

import { AppShell } from "../../../../components/app-shell";
import { CustomerDetailView } from "../../../../features/customers/customer-detail-view";
import { getCustomerDetail } from "../../../../features/customers/data";
import { getLocaleFromValue } from "../../../../lib/i18n";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; customerId: string }>;
}) {
  const resolvedParams = await params;
  const locale = getLocaleFromValue(resolvedParams.locale);

  if (!locale) {
    notFound();
  }

  const customer = await getCustomerDetail(resolvedParams.customerId, locale);

  if (!customer) {
    notFound();
  }

  return (
    <AppShell
      locale={locale}
      section="customers"
      title={locale === "zh" ? `客户: ${customer.name}` : `Customer: ${customer.name}`}
      description={
        locale === "zh"
          ? "客户详情页先打通资料、预约和时间线的占位式组合方式，后续可直接接入真实读模型。"
          : "The detail page now composes profile, appointments, and timeline placeholders in the same shape a real read model will use."
      }
    >
      <CustomerDetailView locale={locale} customer={customer} />
    </AppShell>
  );
}
