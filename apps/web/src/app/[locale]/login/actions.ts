"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "../../../lib/api-client";
import type { AuthSessionResponse } from "../../../lib/api-types";
import { clearSessionCookie, setSessionCookie } from "../../../lib/session";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const workspaceSlug = formData.get("workspaceSlug") as string;
  const email = formData.get("email") as string;
  const name = (formData.get("name") as string) || undefined;
  const locale = (formData.get("locale") as string) || "en";

  if (!workspaceSlug?.trim() || !email?.trim()) {
    return {
      error:
        locale === "zh"
          ? "请填写工作空间和邮箱。"
          : "Workspace slug and email are required.",
    };
  }

  try {
    const response = await apiFetch<AuthSessionResponse>("/auth/login", {
      method: "POST",
      body: {
        workspaceSlug: workspaceSlug.trim(),
        email: email.trim(),
        ...(name ? { name: name.trim() } : {}),
      },
    });

    await setSessionCookie({
      token: response.sessionToken,
      workspaceId: response.workspace.id,
      workspaceSlug: response.workspace.slug,
      workspaceName: response.workspace.name,
      userId: response.user.id,
      userName: response.user.name,
      userEmail: response.user.email,
    });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const status = (error as { status: number }).status;
      if (status === 404) {
        return {
          error:
            locale === "zh"
              ? "未找到该工作空间，请检查 slug 是否正确。"
              : "Workspace not found. Please check the slug.",
        };
      }
    }
    return {
      error:
        locale === "zh"
          ? "登录失败，请确保后端服务正在运行。"
          : "Login failed. Make sure the backend is running.",
    };
  }

  redirect(`/${locale}/dashboard`);
}

export async function logoutAction(): Promise<never> {
  await clearSessionCookie();
  redirect("/en/login");
}
