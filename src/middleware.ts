// middleware.ts (frontend 2) — versión con validación
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, getClientId} from "./utils/env";
import { login } from "./api/auth/login";
const BACKEND_BASE = getBackendUrl();
const CLIENT_ID = getClientId();

export async function middleware(req: NextRequest) {
  const sid = req.cookies.get("sid")?.value;

  if (req.nextUrl.pathname === "/") {
    const u = req.nextUrl.clone();
    u.pathname = "/apphub";
    return NextResponse.redirect(u);
  }

  if(!sid) {
    const urlLogin = await login(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(urlLogin);
  }

  // 🔍 validar que hay token para ESTE client_id
  try {
    const url = new URL(`${BACKEND_BASE}/api/auth/session`);
    url.searchParams.set("clientId", CLIENT_ID);
    // ✅ pásalo por query para que el backend lo lea con @Query('sid')
    url.searchParams.set("sid", sid!);
    console.log(`Se llama a session: ${url} con CLIENT_ID: ${CLIENT_ID} y sid: ${sid}`);
    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });
    console.log("Se llamó a session y se obtuvo: "+res);

    if (res.ok) return NextResponse.next();
  } catch (_) {
    /* ignore */
  }

  // si falta token de este cliente -> inicia su login
  const urlLogin = await login(req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(urlLogin);
}

export const config = {
  matcher: ["/((?!api/auth/|_next/|favicon.ico).*)"],
};
