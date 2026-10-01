import { readWebAuthBffConfig } from "@/utils/auth/config";
import { GatewayRequestError, isGatewayErrorCode } from "./GatewayRequestError";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RESPONSE_BYTES = 64 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function hasJsonContentType(response: Response): boolean {
  return (
    response.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() === "application/json"
  );
}

async function readJson(response: Response): Promise<unknown> {
  if (!hasJsonContentType(response)) throw new GatewayRequestError();

  const declaredLength = response.headers.get("content-length");
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength);
    if (
      !Number.isSafeInteger(parsedLength) ||
      parsedLength < 0 ||
      parsedLength > MAX_RESPONSE_BYTES
    ) {
      throw new GatewayRequestError();
    }
  }

  const reader = response.body?.getReader();
  if (!reader) throw new GatewayRequestError();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new GatewayRequestError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new GatewayRequestError();
  }
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

  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(new URL(path, readWebAuthBffConfig().gatewayUrl), {
      ...init,
      headers,
      cache: "no-store",
      signal,
    });
  } catch {
    throw new GatewayRequestError("AUTH_SERVICE_UNAVAILABLE");
  }

  let payload: unknown;
  try {
    payload = await readJson(response);
  } catch (error) {
    if (signal.aborted) {
      throw new GatewayRequestError("AUTH_SERVICE_UNAVAILABLE");
    }
    throw error;
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
