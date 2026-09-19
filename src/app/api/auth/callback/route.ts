import { NextRequest, NextResponse } from "next/server";
import { readWebAuthBffConfig } from "@/utils/auth/config";
import {
  BINDING_COOKIE,
  clearBindingCookie,
  profileCookie,
  sessionMaxAge,
  sidCookie,
} from "@/utils/auth/cookies";
import { exchangeCode } from "@/utils/auth/gateway-client";
import { normalizeReturnPath } from "@/utils/auth/return-path";

export const dynamic = "force-dynamic";

function safeError(
  reason: string,
  config: ReturnType<typeof readWebAuthBffConfig>,
) {
  const response = NextResponse.redirect(
    new URL(`/auth/error?reason=${reason}`, config.hubOrigin),
  );
  response.cookies.set(clearBindingCookie(config));
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const config = readWebAuthBffConfig();
  const params = request.nextUrl.searchParams;
  if (params.has("error")) return safeError("oidc_error", config);
  const codes = params.getAll("code");
  const states = params.getAll("state");
  const binding = request.cookies.get(BINDING_COOKIE)?.value;
  if (codes.length !== 1 || states.length !== 1 || !binding) {
    return safeError("invalid_callback", config);
  }
  try {
    const result = await exchangeCode({
      code: codes[0],
      state: states[0],
      browserBinding: binding,
    });
    const returnPath = normalizeReturnPath(result.returnPath);
    const maxAge = sessionMaxAge(result.sessionExpiresAt);
    const response = NextResponse.redirect(
      new URL(returnPath, config.hubOrigin),
    );
    response.cookies.set(sidCookie(result.sid, maxAge, config));
    response.cookies.set(profileCookie(result.identity, maxAge, config));
    response.cookies.set(clearBindingCookie(config));
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch {
    return safeError("exchange_failed", config);
  }
}
