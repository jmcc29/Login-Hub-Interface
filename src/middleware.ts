// middleware.ts (frontend 2) — versión con validación
import { NextRequest, NextResponse } from "next/server";
import { login } from "./api/auth/login";
import { tokenStatus } from "./api/auth/token";
import { getClientId } from "./utils/env";

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

  //🔍 validar que hay token para ESTE client_id
  try {
    const {exists, valid} = await tokenStatus(getClientId());
    console.log(`token/verify responde: exists=${exists} valid=${valid}`);
    if (exists && valid) return NextResponse.next();
  } catch (e) {
    console.warn(e);
    /* ignore */
  }
  // si falta token de este cliente -> inicia su login
  const urlLogin = await login(req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(urlLogin);
}

export const config = {
  matcher: ["/((?!api/auth/|_next/|favicon.ico).*)"],
};
