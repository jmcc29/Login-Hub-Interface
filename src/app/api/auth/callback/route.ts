import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/utils/services";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Faltan code/state" }, { status: 400 });
  }

  const r= await apiClient.POST("auth/exchange", {
    code, state
  })
  if (!r.ok) {
    const err = await r.text();
    return NextResponse.json({ error: "exchange_failed", detail: err }, { status: 401 });
  }

  const { sessionId, returnTo } = await r.json();

  const resp = NextResponse.redirect(returnTo || "/apphub", { status: 302 });
  resp.cookies.set({
    name: "sid",
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",   
    secure: false,        // ponlo en true en producción (HTTPS)
    path: "/",
    maxAge: 60 * 60 * 8,  // 8h
  });
  return resp;
}
