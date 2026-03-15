"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "../../lib/api-client";
import type { ReviewResponse } from "../../lib/api-types";
import { getSession } from "../../lib/session";

export type FormState = { error?: string; success?: boolean };

export async function requestReviewAction(
  locale: string,
  customerId: string,
  channel: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch<ReviewResponse>(
      `/workspaces/${session.workspaceId}/reviews`,
      {
        method: "POST",
        body: { customerId, channel },
        token: session.token,
      },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to request review." };
  }

  revalidatePath(`/${locale}/reviews`);
  revalidatePath(`/${locale}/customers/${customerId}`);
  return { success: true };
}

export async function submitReviewAction(
  locale: string,
  reviewId: string,
  rating: number,
  comment: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch<ReviewResponse>(
      `/workspaces/${session.workspaceId}/reviews/${reviewId}`,
      {
        method: "PATCH",
        body: { status: "SUBMITTED", rating, comment: comment || undefined },
        token: session.token,
      },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to submit review." };
  }

  revalidatePath(`/${locale}/reviews`);
  return { success: true };
}
