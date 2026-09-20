import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PresentationIdentity } from "./contracts";
import { SID_COOKIE } from "./cookies";
import {
  evaluateWebSession,
  invalidSessionRedirectPath,
} from "./session-decision";

export async function requireWebSession(): Promise<PresentationIdentity> {
  const sid = (await cookies()).get(SID_COOKIE)?.value;
  const decision = await evaluateWebSession(sid);
  if (decision.kind === "invalid") redirect(invalidSessionRedirectPath());
  if (decision.kind === "unavailable")
    redirect("/auth/error?reason=temporarily_unavailable");
  return decision.identity;
}
