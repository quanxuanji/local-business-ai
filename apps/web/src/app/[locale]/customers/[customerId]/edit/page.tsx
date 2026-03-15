import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../../components/app-shell";
import { FeaturePanel } from "../../../../../components/feature-panel";
import { apiFetch } from "../../../../../lib/api-client";
import type { CustomerResponse } from "../../../../../lib/api-types";
import { getLocaleFromValue } from "../../../../../lib/i18n";
import { getSession } from "../../../../../lib/session";
import {
  updateCustomerAction,
} from "../../../../../features/customers/customer-actions";
import { CustomerForm } from "../../../../../features/customers/customer-form";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ locale: string; customerId: string }>;
}) {
  const { locale: routeLocale, customerId } = await params;
  const locale = getLocaleFromValue(routeLocale);

  if (!locale) notFound();

  const session = await getSession();
  if (!session) notFound();

  let customer: CustomerResponse;
  try {
    customer = await apiFetch<CustomerResponse>(
      `/workspaces/${session.workspaceId}/customers/${customerId}`,
      { token: session.token },
    );
  } catch {
    notFound();
  }

  const boundAction = updateCustomerAction.bind(null, locale, customerId);

  return (
    <AppShell
      locale={locale}
      section="customers"
      title={
        locale === "zh"
          ? `编辑: ${customer.fullName}`
          : `Edit: ${customer.fullName}`
      }
      description={
        locale === "zh"
          ? "修改客户信息并保存。"
          : "Update customer details and save."
      }
    >
      <FeaturePanel
        title={locale === "zh" ? "客户信息" : "Customer details"}
        description={
          locale === "zh"
            ? "修改需要更新的字段。"
            : "Modify the fields you want to update."
        }
      >
        <CustomerForm
          locale={locale}
          action={boundAction}
          defaultValues={{
            firstName: customer.firstName,
            lastName: customer.lastName ?? undefined,
            email: customer.email ?? undefined,
            phone: customer.phone ?? undefined,
            status: customer.status,
            preferredLanguage: customer.preferredLanguage,
            source: customer.source ?? undefined,
            notes: customer.notes ?? undefined,
          }}
          submitLabel={locale === "zh" ? "保存修改" : "Save changes"}
        />
      </FeaturePanel>

      <Link
        href={`/${locale}/customers/${customerId}`}
        className="inline-flex rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-mist"
      >
        {locale === "zh" ? "取消" : "Cancel"}
      </Link>
    </AppShell>
  );
}
