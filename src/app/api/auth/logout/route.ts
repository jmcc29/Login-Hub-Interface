import { NextRequest, NextResponse } from "next/server";

import { readWebAuthBffConfig } from "@/utils/auth/config";
import { logoutSession } from "@/utils/auth/gateway-client";
import {
  clearBindingCookie,
  clearProfileCookie,
  clearSidCookie,
  SID_COOKIE,
} from "@/utils/auth/cookies";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const config = readWebAuthBffConfig();
  const sid = request.cookies.get(SID_COOKIE)?.value;
  let destination = new URL("/", config.hubOrigin);

  if (sid) {
    try {
      destination = new URL(await logoutSession(sid));
    } catch {
      // Cookies are still cleared if an auth service is temporarily unavailable.
    }
  }

  const response = NextResponse.redirect(destination);
  response.cookies.set(clearSidCookie(config));
  response.cookies.set(clearProfileCookie(config));
  response.cookies.set(clearBindingCookie(config));
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  return response;
}
