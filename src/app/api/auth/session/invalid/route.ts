import { NextRequest, NextResponse } from "next/server";
import { readWebAuthBffConfig } from "@/utils/auth/config";
import { clearProfileCookie, clearSidCookie } from "@/utils/auth/cookies";
import { normalizeReturnPath } from "@/utils/auth/return-path";

export const dynamic = "force-dynamic";

function returnPath(request: NextRequest): string {
  try {
    const values = request.nextUrl.searchParams.getAll("returnPath");
    if (values.length !== 1) return "/apphub";
    return normalizeReturnPath(values[0]);
  } catch {
    return "/apphub";
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const config = readWebAuthBffConfig();
  const loginUrl = new URL("/api/auth/login", config.hubOrigin);
  loginUrl.searchParams.set("returnPath", returnPath(request));
  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(clearSidCookie(config));
  response.cookies.set(clearProfileCookie(config));
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  return response;
}
