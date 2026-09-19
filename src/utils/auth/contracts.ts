export interface PresentationIdentity {
  sub: string;
  preferredUsername?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
}

export interface ExchangeResponse {
  sid: string;
  returnPath: string;
  identity: PresentationIdentity;
  sessionExpiresAt: number;
}

export interface SessionCheckResponse {
  authenticated: true;
  identity: PresentationIdentity;
  sessionExpiresAt: number;
}

export type GatewayErrorCode =
  | "INVALID_LOGIN_REQUEST"
  | "LOGIN_STATE_INVALID"
  | "SESSION_INVALID"
  | "WEB_AUTH_DISABLED"
  | "AUTH_SERVICE_UNAVAILABLE"
  | "OIDC_LOGIN_FAILED"
  | "AUTH_UPSTREAM_ERROR";
