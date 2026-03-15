"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "../../lib/api-client";
import type { MessageResponse } from "../../lib/api-types";
import { getSession } from "../../lib/session";

export type FormState = { error?: string; success?: boolean };

export async function createMessageAction(
  locale: string,
  customerId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const body: Record<string, unknown> = {
    customerId,
    channel: formData.get("channel") || "SMS",
    subject: formData.get("subject") || undefined,
    body: formData.get("body"),
  };

  try {
    await apiFetch<MessageResponse>(
      `/workspaces/${session.workspaceId}/messages`,
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
    return { error: "Failed to create message." };
  }

  revalidatePath(`/${locale}/customers/${customerId}`);
  return { success: true };
}

export async function sendMessageAction(
  locale: string,
  messageId: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch<MessageResponse>(
      `/workspaces/${session.workspaceId}/messages/${messageId}/send`,
      { method: "POST", token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to send message." };
  }

  revalidatePath(`/${locale}`);
  return { success: true };
}
