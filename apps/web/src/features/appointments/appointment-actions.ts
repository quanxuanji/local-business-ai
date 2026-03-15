"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiFetch, ApiError } from "../../lib/api-client";
import type { AppointmentResponse } from "../../lib/api-types";
import { getSession } from "../../lib/session";

export type FormState = { error?: string };

export async function createAppointmentAction(
  locale: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const body: Record<string, unknown> = {
    customerId: formData.get("customerId"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    status: formData.get("status") || "SCHEDULED",
    serviceName: formData.get("serviceName") || undefined,
    notes: formData.get("notes") || undefined,
  };

  try {
    await apiFetch<AppointmentResponse>(
      `/workspaces/${session.workspaceId}/appointments`,
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
    return { error: "Failed to create appointment." };
  }

  revalidatePath(`/${locale}/appointments`);
  redirect(`/${locale}/appointments?toast=appointment-created`);
}

export async function updateAppointmentStatusAction(
  locale: string,
  appointmentId: string,
  status: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch<AppointmentResponse>(
      `/workspaces/${session.workspaceId}/appointments/${appointmentId}`,
      { method: "PATCH", body: { status }, token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      const msg =
        typeof e.body === "object" && e.body && "message" in e.body
          ? String((e.body as { message: unknown }).message)
          : e.statusText;
      return { error: msg };
    }
    return { error: "Failed to update appointment." };
  }

  revalidatePath(`/${locale}/appointments`);
  redirect(`/${locale}/appointments?toast=appointment-updated`);
}

export async function deleteAppointmentAction(
  locale: string,
  appointmentId: string,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  try {
    await apiFetch(
      `/workspaces/${session.workspaceId}/appointments/${appointmentId}`,
      { method: "DELETE", token: session.token },
    );
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.statusText };
    }
    return { error: "Failed to delete appointment." };
  }

  revalidatePath(`/${locale}/appointments`);
  redirect(`/${locale}/appointments?toast=appointment-deleted`);
}
