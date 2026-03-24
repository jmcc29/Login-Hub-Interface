import { NextRequest, NextResponse } from "next/server";
import { login } from "./api/auth/login";
import { tokenStatus } from "./api/auth/token";
import { frontend } from "./utils/env";

export async function proxy(req: NextRequest) {
  const sid = req.cookies.get("sid")?.value;
  const clientId = frontend.clientId;
  if (req.nextUrl.pathname === "/") {
    const u = req.nextUrl.clone();
    u.pathname = "/apphub";
    return NextResponse.redirect(u);
  }

  if (!sid) {
    const urlLogin = await login(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(urlLogin);
  }

  try {
    const { exists, valid } = await tokenStatus(clientId);
    console.log(`token/verify responde: exists=${exists} valid=${valid}`);
    if (exists && valid) return NextResponse.next();
  } catch (e) {
    console.warn(e);
  }

  const urlLogin = await login(req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(urlLogin);
}

export const config = {
  matcher: ["/((?!api/auth/|_next/|favicon.ico).*)"],
};