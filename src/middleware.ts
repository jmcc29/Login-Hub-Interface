// middleware.ts (frontend 2) — versión con validación
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, getClientId} from "./utils/env";
const BACKEND_BASE = getBackendUrl();
const CLIENT_ID = getClientId();

export async function middleware(req: NextRequest) {
  const sid = req.cookies.get("sid")?.value;

  if (req.nextUrl.pathname === "/") {
    const u = req.nextUrl.clone();
    u.pathname = "/apphub";
    return NextResponse.redirect(u);
  }

  if (!sid) {
    const u = req.nextUrl.clone();
    u.pathname = "/api/auth/login";
    u.searchParams.set("returnTo", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(u);
  }

  // 🔍 validar que hay token para ESTE client_id
  try {
    const url = new URL(`${BACKEND_BASE}/api/auth/session`);
    url.searchParams.set("client_id", CLIENT_ID);
    // ✅ pásalo por query para que el backend lo lea con @Query('sid')
    url.searchParams.set("sid", sid!);
    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (res.ok) return NextResponse.next();
  } catch (_) {
    /* ignore */
  }

  // si falta token de este cliente -> inicia su login
  const u = req.nextUrl.clone();
  u.pathname = "/api/auth/login";
  u.searchParams.set("returnTo", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(u);
}

export const config = {
  matcher: ["/((?!api/auth/|_next/|favicon.ico).*)"],
};
