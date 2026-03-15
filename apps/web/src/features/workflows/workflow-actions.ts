"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "../../lib/api-client";
import type { WorkflowRuleResponse } from "../../lib/api-types";
import { getSession } from "../../lib/session";

export type FormState = { error?: string; success?: boolean };

export async function createWorkflowRuleAction(
  locale: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const body: Record<string, unknown> = {
    name: formData.get("name"),
    trigger: formData.get("trigger"),
    action: formData.get("action"),
    isActive: formData.get("isActive") === "true",
  };

  try {
    await apiFetch<WorkflowRuleResponse>(
      `/workspaces/${session.workspaceId}/workflow-rules`,
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
    return { error: "Failed to create workflow rule." };
  }

  revalidatePath(`/${locale}/workflows`);
  return { success: true };
}

export async function toggleWorkflowRuleAction(
  locale: string,
  ruleId: string,
  isActive: boolean,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch<WorkflowRuleResponse>(
      `/workspaces/${session.workspaceId}/workflow-rules/${ruleId}`,
      { method: "PATCH", body: { isActive }, token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to update workflow rule." };
  }

  revalidatePath(`/${locale}/workflows`);
  return { success: true };
}

export async function deleteWorkflowRuleAction(
  locale: string,
  ruleId: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch(
      `/workspaces/${session.workspaceId}/workflow-rules/${ruleId}`,
      { method: "DELETE", token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to delete workflow rule." };
  }

  revalidatePath(`/${locale}/workflows`);
  return { success: true };
}
