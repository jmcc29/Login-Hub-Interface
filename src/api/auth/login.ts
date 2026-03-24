"use server";

import { frontend, backend } from "@/utils/env";

export async function login(returnTo = "/apphub"): Promise<string> {
  const frontendUrl = frontend.url;
  const backendUrl = backend.url;

  const loginUrl = new URL(`${backendUrl}/api/auth/login`);
  loginUrl.searchParams.set("returnTo", `${returnTo.startsWith("http") ? returnTo : `${frontendUrl}${returnTo}`}`);
  loginUrl.searchParams.set("clientId", frontend.clientId);

  return loginUrl.toString();
}