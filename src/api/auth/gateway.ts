import {
  ExchangeResponse,
  PresentationIdentity,
  SessionCheckResponse,
  UserContext,
} from "@/utils/interfaces";
import { apiClient, GatewayRequestError } from "@/utils/services";
import { readWebAuthBffConfig } from "@/utils/auth/config";
import { normalizeReturnPath } from "@/utils/auth/return-path";

const OPAQUE_ID = /^[A-Za-z0-9_-]{43,128}$/;
export { GatewayRequestError as GatewayAuthError };

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new GatewayRequestError();
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value) throw new GatewayRequestError();
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
    throw new GatewayRequestError();
  }
  return value as number;
}

async function gatewayPost(
  path: string,
  body: unknown,
  cookie?: string,
): Promise<unknown> {
  return apiClient.POST(path, body, cookie);
}

export async function logoutSession(sid: string): Promise<string> {
  const data = await apiClient.DELETE("/api/auth/logout", `sid=${sid}`);
  const logoutUrl = requiredString(record(data).logoutUrl);
  const url = new URL(logoutUrl);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new GatewayRequestError();
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
    throw new GatewayRequestError();
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
  if (!OPAQUE_ID.test(sid)) throw new GatewayRequestError();
  return {
    sid,
    returnPath: normalizeReturnPath(requiredString(source.returnPath)),
    identity: identity(source.identity),
    sessionExpiresAt: expiresAt(source.sessionExpiresAt),
    sessionAbsoluteExpiresAt: expiresAt(source.sessionAbsoluteExpiresAt),
  };
}

function stringList(value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || !item) ||
    new Set(value).size !== value.length
  )
    throw new GatewayRequestError();
  return [...value];
}

export async function getToolContext(
  sid: string,
  tool: string,
): Promise<UserContext> {
  if (!OPAQUE_ID.test(sid)) throw new GatewayRequestError("SESSION_INVALID");
  if (!/^[a-z][a-z0-9-]{0,63}$/.test(tool)) throw new GatewayRequestError();
  const source = record(
    await gatewayPost("/api/auth/client/context", { tool }, `sid=${sid}`),
  );
  const allowed = [
    "authenticated",
    "currentTool",
    "currentClient",
    "identity",
    "realmRoles",
    "clientRoles",
    "groups",
    "permissions",
    "contextExpiresAt",
    "permissionsExpiresAt",
    "sessionExpiresAt",
    "sessionAbsoluteExpiresAt",
  ];
  if (
    Object.getPrototypeOf(source) !== Object.prototype ||
    Object.keys(source).length !== allowed.length ||
    Object.keys(source).some((key) => !allowed.includes(key)) ||
    source.authenticated !== true ||
    source.currentTool !== tool ||
    !Array.isArray(source.permissions)
  )
    throw new GatewayRequestError();
  const permissions = source.permissions.map((candidate) => {
    const permission = record(candidate);
    if (
      Object.getPrototypeOf(permission) !== Object.prototype ||
      Object.keys(permission).length !== 2 ||
      typeof permission.resource !== "string" ||
      !permission.resource ||
      !Array.isArray(permission.scopes)
    )
      throw new GatewayRequestError();
    return {
      resource: permission.resource,
      scopes: stringList(permission.scopes),
    };
  });
  return {
    authenticated: true,
    currentTool: tool,
    currentClient: requiredString(source.currentClient),
    identity: identity(source.identity),
    realmRoles: stringList(source.realmRoles),
    clientRoles: stringList(source.clientRoles),
    groups: stringList(source.groups),
    permissions,
    contextExpiresAt: expiresAt(source.contextExpiresAt),
    permissionsExpiresAt: expiresAt(source.permissionsExpiresAt),
    sessionExpiresAt: expiresAt(source.sessionExpiresAt),
    sessionAbsoluteExpiresAt: expiresAt(source.sessionAbsoluteExpiresAt),
  };
}

export async function getUserContext(sid: string): Promise<UserContext> {
  return getToolContext(sid, readWebAuthBffConfig().toolKey);
}

export async function checkSession(sid: string): Promise<SessionCheckResponse> {
  if (!OPAQUE_ID.test(sid)) throw new GatewayRequestError("SESSION_INVALID");
  const source = record(await gatewayPost("/api/auth/session/check", { sid }));
  if (source.authenticated !== true) throw new GatewayRequestError();
  return {
    authenticated: true,
    identity: identity(source.identity),
    sessionExpiresAt: expiresAt(source.sessionExpiresAt),
  };
}
