import {
  ExchangeResponse,
  GatewayErrorCode,
  PresentationIdentity,
  SessionCheckResponse,
} from "./contracts";
import { readWebAuthBffConfig } from "./config";
import { normalizeReturnPath } from "./return-path";

const OPAQUE_ID = /^[A-Za-z0-9_-]{43,128}$/;
const errorCodes = new Set<GatewayErrorCode>([
  "INVALID_LOGIN_REQUEST",
  "LOGIN_STATE_INVALID",
  "SESSION_INVALID",
  "WEB_AUTH_DISABLED",
  "AUTH_SERVICE_UNAVAILABLE",
  "OIDC_LOGIN_FAILED",
  "AUTH_UPSTREAM_ERROR",
]);

export class GatewayAuthError extends Error {
  constructor(readonly code: GatewayErrorCode = "AUTH_UPSTREAM_ERROR") {
    super("Authentication request failed");
  }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new GatewayAuthError();
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value) throw new GatewayAuthError();
  return value;
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return requiredString(value);
}

function identity(value: unknown): PresentationIdentity {
  const source = record(value);
  return {
    sub: requiredString(source.sub),
    preferredUsername: optionalString(source.preferredUsername),
    name: optionalString(source.name),
    givenName: optionalString(source.givenName),
    familyName: optionalString(source.familyName),
    email: optionalString(source.email),
  };
}

function expiresAt(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) <= Date.now()) {
    throw new GatewayAuthError();
  }
  return value as number;
}

async function gatewayPost(
  path: string,
  body: unknown,
  cookie?: string,
): Promise<unknown> {
  const config = readWebAuthBffConfig();
  let response: Response;
  try {
    response = await fetch(new URL(path, config.gatewayUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    throw new GatewayAuthError("AUTH_SERVICE_UNAVAILABLE");
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new GatewayAuthError();
  }
  if (!response.ok) {
    const source = record(data);
    const publicError = record(source.error);
    const code = publicError.code;
    throw new GatewayAuthError(
      typeof code === "string" && errorCodes.has(code as GatewayErrorCode)
        ? (code as GatewayErrorCode)
        : "AUTH_UPSTREAM_ERROR",
    );
  }
  return data;
}

export async function logoutSession(sid: string): Promise<string> {
  const config = readWebAuthBffConfig();
  let response: Response;
  try {
    response = await fetch(new URL("/api/auth/logout", config.gatewayUrl), {
      method: "DELETE",
      headers: { Cookie: `sid=${sid}` },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    throw new GatewayAuthError("AUTH_SERVICE_UNAVAILABLE");
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new GatewayAuthError();
  }
  if (!response.ok) {
    const source = record(data);
    const publicError = record(source.error);
    const code = publicError.code;
    throw new GatewayAuthError(
      typeof code === "string" && errorCodes.has(code as GatewayErrorCode)
        ? (code as GatewayErrorCode)
        : "AUTH_UPSTREAM_ERROR",
    );
  }
  const logoutUrl = requiredString(record(data).logoutUrl);
  const url = new URL(logoutUrl);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new GatewayAuthError();
  }
  return logoutUrl;
}

export async function startLogin(
  returnPath: string,
  browserBinding: string,
): Promise<string> {
  const source = record(
    await gatewayPost("/api/auth/login/start", {
      returnPath,
      browserBinding,
    }),
  );
  const authorizationUrl = requiredString(source.authorizationUrl);
  const url = new URL(authorizationUrl);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.hash
  ) {
    throw new GatewayAuthError();
  }
  return authorizationUrl;
}

export async function exchangeCode(input: {
  code: string;
  state: string;
  browserBinding: string;
}): Promise<ExchangeResponse> {
  const source = record(await gatewayPost("/api/auth/exchange", input));
  const sid = requiredString(source.sid);
  if (!OPAQUE_ID.test(sid)) throw new GatewayAuthError();
  return {
    sid,
    returnPath: normalizeReturnPath(requiredString(source.returnPath)),
    identity: identity(source.identity),
    sessionExpiresAt: expiresAt(source.sessionExpiresAt),
    sessionAbsoluteExpiresAt: expiresAt(source.sessionAbsoluteExpiresAt),
  };
}

export async function checkSession(sid: string): Promise<SessionCheckResponse> {
  if (!OPAQUE_ID.test(sid)) throw new GatewayAuthError("SESSION_INVALID");
  const source = record(await gatewayPost("/api/auth/session/check", { sid }));
  if (source.authenticated !== true) throw new GatewayAuthError();
  return {
    authenticated: true,
    identity: identity(source.identity),
    sessionExpiresAt: expiresAt(source.sessionExpiresAt),
  };
}
