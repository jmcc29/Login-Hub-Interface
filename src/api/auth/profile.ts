// src/server/auth/profile.ts
"use server";
import { apiClient } from "@/utils/services";

export async function getProfile() {
  try {
    const r = await apiClient.GET("auth/profile");
    const data = await r.json();
    return data?.ok === false ? null : data;
  } catch { return null; }
}
