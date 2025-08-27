// src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/utils/envs";
import { getFrontendUrl } from "@/utils/envs";
export async function GET(req: NextRequest) {
  const backendBase = getBackendUrl();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Faltan code/state" }, { status: 400 });
  }
  
  const r = await fetch(`${backendBase}/api/auth/exchange`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, state }),
  });

  if (!r.ok) {
    const err = await r.text();
    return NextResponse.json({ error: "exchange_failed", detail: err }, { status: 401 });
  }

  const { sessionId, returnTo } = await r.json();

  const resp = NextResponse.redirect(returnTo || "/modules", { status: 302 });
  resp.cookies.set({
    name: "sid",
    value: sessionId,
    httpOnly: true,
    sameSite: "strict",   // same-origin: perfecto para BFF
    secure: false,        // ponlo en true en producción (HTTPS)
    path: "/",
    maxAge: 60 * 60 * 8,  // 8h
  });
  // Si hubieras usado cookie oauth_state en Next, aquí la limpiarías.
  return resp;
}
