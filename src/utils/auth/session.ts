import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PresentationIdentity, UserContext } from "@/utils/interfaces";
import { SID_COOKIE } from "./cookies";
import {
  GatewayAuthError,
  getUserContext as requestUserContext,
} from "@/api/auth/gateway";
import { invalidSessionRedirectPath } from "./session-decision";

export const requireUserContext = cache(async (): Promise<UserContext> => {
  const sid = (await cookies()).get(SID_COOKIE)?.value;
  if (!sid) redirect(invalidSessionRedirectPath());
  try {
    return await requestUserContext(sid);
  } catch (error) {
    if (error instanceof GatewayAuthError && error.code === "SESSION_INVALID")
      redirect(invalidSessionRedirectPath());
    redirect("/auth/error?reason=temporarily_unavailable");
  }
});

export async function requireWebSession(): Promise<PresentationIdentity> {
  return (await requireUserContext()).identity;
}
