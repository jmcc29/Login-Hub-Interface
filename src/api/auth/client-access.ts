"use server";

import { apiClient } from "@/utils/services";
import { Permission, User } from "@/utils/interfaces";

export interface PreparedClientAccess {
  ok: boolean;
  profile?: User;
  permissions?: Permission;
};

export async function prepareClientAccess(
  clientId: string,
  audience: string = clientId,
): Promise<PreparedClientAccess> {
  const r = await apiClient.POST("auth/token/exchange", {
    audience,
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "No se pudo preparar acceso al cliente destino");
  }

  return (await r.json()) as PreparedClientAccess;
}