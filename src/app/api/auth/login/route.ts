import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { readWebAuthBffConfig } from "@/utils/auth/config";
import { bindingCookie, clearBindingCookie } from "@/utils/auth/cookies";
import { startLogin } from "@/utils/auth/gateway-client";
import { normalizeReturnPath } from "@/utils/auth/return-path";

export const dynamic = "force-dynamic";

function errorRedirect(
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
  const values = request.nextUrl.searchParams.getAll("returnPath");
  if (values.length > 1) return errorRedirect("invalid_request", config);
  try {
    const returnPath = normalizeReturnPath(values[0]);
    const browserBinding = randomBytes(32).toString("base64url");
    const authorizationUrl = await startLogin(returnPath, browserBinding);
    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set(bindingCookie(browserBinding, config));
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch {
    return errorRedirect("login_unavailable", config);
  }
}
