import { PresentationIdentity } from "./contracts";
import { WebAuthBffConfig } from "./config";

interface CookieDefinition {
  name: string;
  value: string;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
}

export const BINDING_COOKIE = "oidc_binding";
export const SID_COOKIE = "sid";
export const PROFILE_COOKIE = "profile";

export function bindingCookie(
  value: string,
  config: WebAuthBffConfig,
): CookieDefinition {
  return {
    name: BINDING_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookies,
    path: "/api/auth",
    maxAge: config.bindingTtlSeconds,
  };
}

export function clearBindingCookie(config: WebAuthBffConfig): CookieDefinition {
  return { ...bindingCookie("", config), maxAge: 0 };
}

export function sessionMaxAge(expiresAt: number, now = Date.now()): number {
  if (!Number.isSafeInteger(expiresAt)) {
    throw new Error("INVALID_SESSION_EXPIRY");
  }
  const seconds = Math.floor((expiresAt - now) / 1000);
  if (!Number.isSafeInteger(seconds) || seconds < 1) {
    throw new Error("INVALID_SESSION_EXPIRY");
  }
  return seconds;
}

export function sidCookie(
  value: string,
  maxAge: number,
  config: WebAuthBffConfig,
): CookieDefinition {
  return {
    name: SID_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookies,
    path: "/",
    maxAge,
  };
}

export function clearSidCookie(config: WebAuthBffConfig): CookieDefinition {
  return sidCookie("", 0, config);
}

export function profileCookie(
  identity: PresentationIdentity,
  maxAge: number,
  config: WebAuthBffConfig,
): CookieDefinition {
  return {
    name: PROFILE_COOKIE,
    value: JSON.stringify(identity),
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookies,
    path: "/",
    maxAge,
  };
}

export function clearProfileCookie(config: WebAuthBffConfig): CookieDefinition {
  return {
    name: PROFILE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookies,
    path: "/",
    maxAge: 0,
  };
}
