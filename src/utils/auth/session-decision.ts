import { PresentationIdentity } from "./contracts";
import { checkSession, GatewayAuthError } from "./gateway-client";

export type SessionDecision =
  | { kind: "authenticated"; identity: PresentationIdentity }
  | { kind: "invalid" }
  | { kind: "unavailable" };

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
