export const gatewayErrorCodes = [
  "INVALID_LOGIN_REQUEST",
  "LOGIN_STATE_INVALID",
  "SESSION_INVALID",
  "WEB_AUTH_DISABLED",
  "AUTH_SERVICE_UNAVAILABLE",
  "OIDC_LOGIN_FAILED",
  "AUTH_UPSTREAM_ERROR",
  "INVALID_CLIENT_REQUEST",
  "WEB_TOOL_UNAVAILABLE",
] as const;

export type GatewayErrorCode = (typeof gatewayErrorCodes)[number];

export class GatewayRequestError extends Error {
  constructor(readonly code: GatewayErrorCode = "AUTH_UPSTREAM_ERROR") {
    super("Authentication request failed");
    this.name = "GatewayRequestError";
  }
}

export function isGatewayErrorCode(value: unknown): value is GatewayErrorCode {
  return (
    typeof value === "string" &&
    gatewayErrorCodes.includes(value as GatewayErrorCode)
  );
}
