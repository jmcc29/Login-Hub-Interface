import { PresentationIdentity } from "@/utils/interfaces";
import { checkSession, GatewayAuthError } from "@/api/auth/gateway";

export type SessionDecision =
  | { kind: "authenticated"; identity: PresentationIdentity }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export function invalidSessionRedirectPath(): string {
  return "/api/auth/session/invalid?returnPath=/apphub";
}

export async function evaluateWebSession(
  sid: string | undefined,
  checker: typeof checkSession = checkSession,
): Promise<SessionDecision> {
  if (!sid) return { kind: "invalid" };

  try {
    return { kind: "authenticated", identity: (await checker(sid)).identity };
  } catch (error) {
    return error instanceof GatewayAuthError && error.code === "SESSION_INVALID"
      ? { kind: "invalid" }
      : { kind: "unavailable" };
  }
}
