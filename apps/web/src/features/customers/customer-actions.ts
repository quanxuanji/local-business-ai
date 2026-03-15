"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiFetch, ApiError } from "../../lib/api-client";
import type { CustomerResponse } from "../../lib/api-types";
import { getSession } from "../../lib/session";

export type FormState = { error?: string };

export async function createCustomerAction(
  locale: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const body: Record<string, unknown> = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || undefined,
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    status: formData.get("status") || "NEW_LEAD",
    preferredLanguage: formData.get("preferredLanguage") || "EN",
    source: formData.get("source") || undefined,
    notes: formData.get("notes") || undefined,
  };

  let created: CustomerResponse;
  try {
    created = await apiFetch<CustomerResponse>(
      `/workspaces/${session.workspaceId}/customers`,
      { method: "POST", body, token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      const msg =
        typeof e.body === "object" && e.body && "message" in e.body
          ? String((e.body as { message: unknown }).message)
          : e.statusText;
      return { error: msg };
    }
    return { error: "Failed to create customer." };
  }

  redirect(`/${locale}/customers/${created.id}`);
}

export async function updateCustomerAction(
  locale: string,
  customerId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const body: Record<string, unknown> = {};
  for (const key of [
    "firstName",
    "lastName",
    "email",
    "phone",
    "status",
    "preferredLanguage",
    "source",
    "notes",
  ]) {
    const val = formData.get(key);
    if (val !== null) body[key] = val || undefined;
  }

  try {
    await apiFetch<CustomerResponse>(
      `/workspaces/${session.workspaceId}/customers/${customerId}`,
      { method: "PATCH", body, token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      const msg =
        typeof e.body === "object" && e.body && "message" in e.body
          ? String((e.body as { message: unknown }).message)
          : e.statusText;
      return { error: msg };
    }
    return { error: "Failed to update customer." };
  }

  revalidatePath(`/${locale}/customers/${customerId}`);
  redirect(`/${locale}/customers/${customerId}`);
}

export async function deleteCustomerAction(
  locale: string,
  customerId: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch(
      `/workspaces/${session.workspaceId}/customers/${customerId}`,
      { method: "DELETE", token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to delete customer." };
  }

  revalidatePath(`/${locale}/customers`);
  redirect(`/${locale}/customers`);
}
