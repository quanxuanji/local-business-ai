import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../components/app-shell";
import { FeaturePanel } from "../../../../components/feature-panel";
import {
  createCustomerAction,
} from "../../../../features/customers/customer-actions";
import { CustomerForm } from "../../../../features/customers/customer-form";
import { getLocaleFromValue } from "../../../../lib/i18n";

export default async function NewCustomerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) notFound();

  const boundAction = createCustomerAction.bind(null, locale);

  return (
    <AppShell
      locale={locale}
      section="customers"
      title={locale === "zh" ? "新建客户" : "New customer"}
      description={
        locale === "zh"
          ? "填写客户信息，创建新的客户记录。"
          : "Fill in the customer details to create a new record."
      }
    >
      <FeaturePanel
        title={locale === "zh" ? "客户信息" : "Customer details"}
        description={
          locale === "zh"
            ? "带 * 号的为必填字段。"
            : "Fields marked with * are required."
        }
      >
        <CustomerForm
          locale={locale}
          action={boundAction}
          submitLabel={locale === "zh" ? "创建客户" : "Create customer"}
        />
      </FeaturePanel>

      <Link
        href={`/${locale}/customers`}
        className="inline-flex rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-mist"
      >
        {locale === "zh" ? "返回客户列表" : "Back to customers"}
      </Link>
    </AppShell>
  );
}
