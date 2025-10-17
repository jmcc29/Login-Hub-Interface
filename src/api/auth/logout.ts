"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/utils/services";

export async function logout(): Promise<void> {

  try {
    await apiClient.POST("auth/logout", {});
  } catch {
    // opcional: log interno; no rompas el flujo de UI
  } finally {
    (await cookies()).delete("sid"); 
  }
}
