"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiClient } from "@/utils/services";
import { login } from "./login";

export async function logout(): Promise<never> {
  try {
    await apiClient.DELETE("auth/logout", {});
  } catch {
    // opcional
  } finally {
    const cookieStore = await cookies();

    cookieStore.set("sid", "", {
      path: "/",
      maxAge: 0,
    });

    cookieStore.set("profile", "", {
      path: "/",
      maxAge: 0,
    });
  }

  const loginUrl = await login("/apphub");
  redirect(loginUrl);
}