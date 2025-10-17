"use server";

import { getFrontendUrl, getBackendUrl, getClientId } from "@/utils/env";

export async function login(returnTo = "/apphub"): Promise<string> {
  const frontend = getFrontendUrl();
  const backend = getBackendUrl();

  // Igual que el endpoint /api/auth/login
  const loginUrl = new URL(`${backend}/api/auth/login`);
  loginUrl.searchParams.set("returnTo", `${frontend}${returnTo}`);
  loginUrl.searchParams.set("clientId", getClientId());
  // Devolvemos la URL a donde redirigir
  return loginUrl.toString();
}
