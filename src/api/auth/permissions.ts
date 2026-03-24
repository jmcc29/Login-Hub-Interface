"use server";
import { frontend } from '@/utils/env';
import { apiClient } from "@/utils/services";
import { Permission } from "@/utils/interfaces";
/** Pide permisos UMA para un audience (agrupa rs:scope) */
export async function getPermissions(audience: string): Promise<Permission[]> {
  const clientId = frontend.clientId;
  const r = await apiClient.GET("auth/permissions", {audience, clientId} );
  const data  = await r.json();
  return data.permissions;
}