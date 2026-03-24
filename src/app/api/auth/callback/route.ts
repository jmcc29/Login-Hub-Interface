import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/utils/services";
import { login } from "@/api/auth/login";
import { externalFrontends, frontend } from "@/utils/env";

function resolveTargetClientIdFromReturnTo(returnTo?: string): string | null {
  if (!returnTo) return null;

  try {
    const targetOrigin = new URL(returnTo).origin;
    const hubOrigin = new URL(frontend.url).origin;
    console.log("TARGET ORIGIN:", targetOrigin);
    console.log("HUB ORIGIN:", hubOrigin);
    // Si vuelve al propio hub, no hay cliente externo que preparar
    if (targetOrigin === hubOrigin) {
      return null;
    }

    for (const target of Object.values(externalFrontends)) {
      const configuredOrigin = new URL(target.url).origin;

      if (targetOrigin === configuredOrigin) {
        return target.clientId;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Faltan code/state" }, { status: 400 });
  }

  const sid = req.cookies.get("sid")?.value ?? undefined;

  try {
    const r = await apiClient.POST("auth/exchange", {
      code,
      state,
      sidCookie: sid,
    });

    const data = await r.json();

    const sessionId = data.sid ?? data.sessionId;
    const returnTo = data.returnTo;
    const profile = data.profile;

    if (!sessionId) {
      return NextResponse.json(
        { error: "exchange_failed", detail: "No se recibió sid/sessionId" },
        { status: 500 },
      );
    }

    const targetClientId = resolveTargetClientIdFromReturnTo(returnTo);

    console.log("Target client ID resolved from returnTo:", targetClientId);

    if (targetClientId) {
      const exchangeResp = await apiClient.POST("auth/token/exchange", {
        sid: sessionId,
        audience: targetClientId,
      });

      if (!exchangeResp.ok) {
        const text = await exchangeResp.text();
        return NextResponse.json(
          {
            error: "prepare_target_client_failed",
            detail: text || `No se pudo preparar el cliente ${targetClientId}`,
          },
          { status: 401 },
        );
      }
    }

    const resp = NextResponse.redirect(returnTo || "/apphub", { status: 302 });

    resp.cookies.set({
      name: "sid",
      value: sessionId,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    resp.cookies.set({
      name: "profile",
      value: JSON.stringify({
        sub: profile.sub,
        username: profile.username,
        name: profile.name,
        givenName: profile.givenName,
        familyName: profile.familyName,
        email: profile.email,
      }),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return resp;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("State no encontrado o expirado")) {
      const resp = NextResponse.redirect(await login("/apphub"), {
        status: 302,
      });

      resp.cookies.set({
        name: "sid",
        value: "",
        path: "/",
        maxAge: 0,
      });

      resp.cookies.set({
        name: "profile",
        value: "",
        path: "/",
        maxAge: 0,
      });

      return resp;
    }

    console.error("Error en callback exchange:", message);

    return NextResponse.json(
      { error: "exchange_failed", detail: message },
      { status: 401 },
    );
  }
}