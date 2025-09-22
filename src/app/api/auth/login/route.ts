import { NextRequest, NextResponse } from "next/server";
import { getFrontendUrl, getBackendUrl, getClientId } from "@/utils/env";
export async function GET(req: NextRequest) {
  const frontendOrigin = getFrontendUrl();
  const backendBase = getBackendUrl();
  const url = new URL(req.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/apphub";
  const loginUrl = new URL(`${backendBase}/api/auth/login`);

  loginUrl.searchParams.set("client_id", getClientId());
  loginUrl.searchParams.set("returnTo", `${frontendOrigin}${returnTo}`);

  return NextResponse.redirect(loginUrl.toString(), { status: 302 });
}
