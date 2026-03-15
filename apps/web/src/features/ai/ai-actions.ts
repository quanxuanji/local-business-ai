"use server";

import { apiFetch, ApiError } from "../../lib/api-client";
import type {
  AiSummaryResponse,
  AiNextActionResponse,
} from "../../lib/api-types";
import { getSession } from "../../lib/session";

export type AiResult = { text?: string; error?: string };

export async function getCustomerSummaryAction(
  customerId: string,
  customerName: string,
  notes: string,
  status: string,
): Promise<AiResult> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    const resp = await apiFetch<AiSummaryResponse>("/ai/customer-summary", {
      method: "POST",
      body: {
        customerId,
        customerName,
        notes: notes || undefined,
        status,
        businessName: session.workspaceName,
      },
      token: session.token,
    });
    return { text: resp.summary };
  } catch (e) {
    if (e instanceof ApiError) return { error: e.statusText };
    return { error: "AI request failed." };
  }
}

export async function getNextActionAction(
  customerId: string,
  customerName: string,
  status: string,
  context: string,
): Promise<AiResult> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    const resp = await apiFetch<AiNextActionResponse>("/ai/next-action", {
      method: "POST",
      body: { customerId, customerName, status, context: context || undefined },
      token: session.token,
    });
    return { text: resp.suggestion };
  } catch (e) {
    if (e instanceof ApiError) return { error: e.statusText };
    return { error: "AI request failed." };
  }
}
