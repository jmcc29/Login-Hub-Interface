import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as callback } from "./callback/route";
import { GET as login } from "./login/route";
import { GET as clearInvalidSession } from "./session/invalid/route";

const binding = "b".repeat(43);
const sid = "s".repeat(43);

function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("OIDC BFF routes", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("GATEWAY_INTERNAL_URL", "http://gateway.test");
    vi.stubEnv("HUB_PUBLIC_ORIGIN", "http://hub.test");
    vi.stubEnv("AUTH_COOKIE_SECURE", "false");
    vi.stubEnv("AUTH_PENDING_TTL_SECONDS", "600");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("starts login server-side with a cryptographic binding cookie", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        authorizationUrl: "https://id.test/authorize?state=opaque-state",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const response = await login(
      new NextRequest(
        "http://hub.test/api/auth/login?returnPath=/apphub/tools",
      ),
    );
    expect(response.headers.get("location")).toBe(
      "https://id.test/authorize?state=opaque-state",
    );
    const cookie = response.cookies.get("oidc_binding");
    expect(cookie?.value).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(cookie).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/api/auth",
      maxAge: 600,
    });
    const request = fetchMock.mock.calls[0];
    expect(request[0].toString()).toBe(
      "http://gateway.test/api/auth/login/start",
    );
    const body = JSON.parse(request[1].body as string);
    expect(body).toEqual({
      returnPath: "/apphub/tools",
      browserBinding: cookie?.value,
    });
    expect(response.headers.get("location")).not.toContain(cookie!.value);
    expect(request[1]).toMatchObject({ method: "POST", cache: "no-store" });
  });

  it("uses /apphub by default and rejects unsafe return paths", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ authorizationUrl: "https://id.test/authorize" }),
      );
    vi.stubGlobal("fetch", fetchMock);
    await login(new NextRequest("http://hub.test/api/auth/login"));
    expect(
      JSON.parse(fetchMock.mock.calls[0][1].body as string).returnPath,
    ).toBe("/apphub");
    for (const value of [
      "https://evil.test/apphub",
      "//evil.test/apphub",
      "/apphub%5Coutside",
      "/apphub%23fragment",
      "/outside",
    ]) {
      fetchMock.mockClear();
      const response = await login(
        new NextRequest(
          `http://hub.test/api/auth/login?returnPath=${encodeURIComponent(value)}`,
        ),
      );
      expect(response.headers.get("location")).toBe(
        "http://hub.test/auth/error?reason=login_unavailable",
      );
      expect(fetchMock).not.toHaveBeenCalled();
    }
  });

  it("sets only sid and presentation profile after a valid callback", async () => {
    const absoluteExpiresAt = Date.now() + 480_000;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            sid,
            returnPath: "/apphub?view=summary",
            identity: {
              sub: "person-1",
              preferredUsername: "person",
              name: "Test Person",
              roles: ["must-not-leak"],
            },
            sessionExpiresAt: Date.now() + 120_000,
            sessionAbsoluteExpiresAt: absoluteExpiresAt,
            accessToken: "must-not-leak",
          },
          200,
          { "Set-Cookie": "gateway-cookie=must-not-forward" },
        ),
      ),
    );
    const response = await callback(
      new NextRequest(
        "http://hub.test/api/auth/callback?code=code&state=state",
        { headers: { cookie: `oidc_binding=${binding}` } },
      ),
    );
    expect(response.headers.get("location")).toBe(
      "http://hub.test/apphub?view=summary",
    );
    expect(response.cookies.get("sid")).toMatchObject({
      value: sid,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    const profile = response.cookies.get("profile");
    expect(response.cookies.get("sid")?.maxAge).toBe(profile?.maxAge);
    expect(response.cookies.get("sid")!.maxAge).toBeGreaterThan(400);
    expect(JSON.parse(profile!.value)).toEqual({
      sub: "person-1",
      preferredUsername: "person",
      name: "Test Person",
    });
    expect(response.cookies.get("oidc_binding")).toMatchObject({
      value: "",
      path: "/api/auth",
      maxAge: 0,
    });
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).not.toContain("msp=");
    expect(setCookie).not.toContain("user=");
    expect(setCookie).not.toContain("access=");
    expect(setCookie).not.toContain("must-not-leak");
    expect(setCookie).not.toContain("gateway-cookie");
  });

  it.each([undefined, null, "invalid", 1.5, Date.now() - 1])(
    "rejects an invalid absolute session expiry without setting session cookies",
    async (sessionAbsoluteExpiresAt) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse({
            sid,
            returnPath: "/apphub",
            identity: { sub: "person-1" },
            sessionExpiresAt: Date.now() + 120_000,
            ...(sessionAbsoluteExpiresAt === undefined
              ? {}
              : { sessionAbsoluteExpiresAt }),
          }),
        ),
      );
      const response = await callback(
        new NextRequest(
          "http://hub.test/api/auth/callback?code=code&state=state",
          { headers: { cookie: `oidc_binding=${binding}` } },
        ),
      );
      expect(response.headers.get("location")).toBe(
        "http://hub.test/auth/error?reason=exchange_failed",
      );
      expect(response.cookies.get("sid")).toBeUndefined();
      expect(response.cookies.get("profile")).toBeUndefined();
    },
  );

  it("clears invalid session cookies before restarting login", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await clearInvalidSession(
      new NextRequest(
        "http://hub.test/api/auth/session/invalid?returnPath=%2Fapphub%2Freports%3Fpage%3D2",
      ),
    );
    expect(response.headers.get("location")).toBe(
      "http://hub.test/api/auth/login?returnPath=%2Fapphub%2Freports%3Fpage%3D2",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    for (const name of ["sid", "profile"]) {
      expect(response.cookies.get(name)).toMatchObject({
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 0,
      });
    }
    const repeated = await clearInvalidSession(
      new NextRequest("http://hub.test/api/auth/session/invalid"),
    );
    expect(repeated.headers.get("location")).toBe(
      "http://hub.test/api/auth/login?returnPath=%2Fapphub",
    );
    expect(repeated.cookies.get("sid")?.maxAge).toBe(0);
    expect(repeated.cookies.get("profile")?.maxAge).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    "https://evil.test/apphub",
    "//evil.test/apphub",
    "/outside",
    "/apphub%2Foutside",
  ])("falls back safely when clearing with returnPath %s", async (value) => {
    const response = await clearInvalidSession(
      new NextRequest(
        `http://hub.test/api/auth/session/invalid?returnPath=${encodeURIComponent(value)}`,
      ),
    );
    expect(response.headers.get("location")).toBe(
      "http://hub.test/api/auth/login?returnPath=%2Fapphub",
    );
  });

  it.each([
    "http://hub.test/api/auth/callback",
    "http://hub.test/api/auth/callback?code=a&code=b&state=s",
    "http://hub.test/api/auth/callback?code=a&state=s&state=t",
    "http://hub.test/api/auth/callback?error=access_denied&error_description=private",
  ])("sanitizes an invalid callback and always clears binding", async (url) => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await callback(
      new NextRequest(url, { headers: { cookie: `oidc_binding=${binding}` } }),
    );
    expect(response.headers.get("location")).toMatch(
      /^http:\/\/hub\.test\/auth\/error\?reason=/,
    );
    expect(response.headers.get("location")).not.toContain("private");
    expect(response.cookies.get("oidc_binding")).toMatchObject({
      path: "/api/auth",
      maxAge: 0,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears binding when exchange rejects an absent or altered binding", async () => {
    const response = await callback(
      new NextRequest("http://hub.test/api/auth/callback?code=a&state=s"),
    );
    expect(response.headers.get("location")).toBe(
      "http://hub.test/auth/error?reason=invalid_callback",
    );
    expect(response.cookies.get("oidc_binding")?.maxAge).toBe(0);

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ error: { code: "LOGIN_STATE_INVALID" } }, 401),
        ),
    );
    const altered = await callback(
      new NextRequest("http://hub.test/api/auth/callback?code=a&state=s", {
        headers: { cookie: `oidc_binding=${"x".repeat(43)}` },
      }),
    );
    expect(altered.headers.get("location")).toBe(
      "http://hub.test/auth/error?reason=exchange_failed",
    );
    expect(altered.cookies.get("oidc_binding")?.maxAge).toBe(0);
  });
});
