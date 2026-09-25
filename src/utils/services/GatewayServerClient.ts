import { readWebAuthBffConfig } from "@/utils/auth/config";
import { GatewayRequestError, isGatewayErrorCode } from "./GatewayRequestError";

const REQUEST_TIMEOUT_MS = 4_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

async function request(
  path: string,
  init: RequestInit,
  cookie?: string,
): Promise<unknown> {
  const headers = {
    ...(init.headers as Record<string, string> | undefined),
    ...(cookie ? { Cookie: cookie } : {}),
  };

  let response: Response;
  try {
    response = await fetch(new URL(path, readWebAuthBffConfig().gatewayUrl), {
      ...init,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new GatewayRequestError("AUTH_SERVICE_UNAVAILABLE");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new GatewayRequestError();
  }

  if (!response.ok) {
    const error =
      isRecord(payload) && isRecord(payload.error) ? payload.error : undefined;
    throw new GatewayRequestError(
      isGatewayErrorCode(error?.code) ? error.code : "AUTH_UPSTREAM_ERROR",
    );
  }

  return payload;
}

export const apiClient = {
  POST(path: string, body: unknown, cookie?: string): Promise<unknown> {
    return request(
      path,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      cookie,
    );
  },

  DELETE(path: string, cookie?: string): Promise<unknown> {
    return request(path, { method: "DELETE" }, cookie);
  },
};
