// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFrontendUrl, getBackendUrl } from "@/utils/envs";
export async function GET(req: NextRequest) {
  const frontendOrigin = getFrontendUrl();
  const backendBase = getBackendUrl();
  const url = new URL(req.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/modules";

  // El backend construirá la URL de autorización con redirect_uri = <FRONT>/api/auth/callback
  // y preservará returnTo internamente.
  const loginUrl = new URL(`${backendBase}/api/auth/login`);
  loginUrl.searchParams.set("returnTo", `${frontendOrigin}${returnTo}`);

  return NextResponse.redirect(loginUrl.toString(), { status: 302 });
}
