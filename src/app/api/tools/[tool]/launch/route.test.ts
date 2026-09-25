import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const sid = "s".repeat(43);
const now = Date.now();
const contextResponse = {
  authenticated: true,
  currentTool: "beneficiary",
  currentClient: "beneficiary-interface",
  identity: { sub: "person-1" },
  realmRoles: [],
  clientRoles: ["user"],
  groups: [],
  permissions: [{ resource: "persons", scopes: ["read"] }],
  contextExpiresAt: now + 60_000,
  permissionsExpiresAt: now + 60_000,
  sessionExpiresAt: now + 120_000,
  sessionAbsoluteExpiresAt: now + 240_000,
};

function request() {
  return new NextRequest("http://hub.test/api/tools/beneficiary/launch", {
    headers: { cookie: `sid=${sid}` },
  });
}

function call(tool = "beneficiary") {
  return GET(request(), { params: Promise.resolve({ tool }) });
}

describe("tool launch route", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("GATEWAY_INTERNAL_URL", "http://gateway.test");
    vi.stubEnv("HUB_PUBLIC_ORIGIN", "http://hub.test");
    vi.stubEnv("AUTH_COOKIE_SECURE", "false");
    vi.stubEnv("AUTH_PENDING_TTL_SECONDS", "600");
    vi.stubEnv("AUTH_TOOL_KEY", "hub");
    vi.stubEnv("NEXT_PUBLIC_FRONTEND_HOST", "frontend.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("validates the selected tool before redirecting to its fixed URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(contextResponse), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await call();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://frontend.test:3002/persons",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("pragma")).toBe("no-cache");
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://gateway.test/api/auth/client/context");
    expect(JSON.parse(String(init.body))).toEqual({ tool: "beneficiary" });
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      Cookie: `sid=${sid}`,
    });
  });

  it("returns to a freshly rendered Hub when launch is denied", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: "WEB_CLIENT_ACCESS_DENIED",
              message: "Web client access was denied",
            },
          }),
          { status: 403, headers: { "content-type": "application/json" } },
        ),
      ),
    );

    const response = await call();
    expect(response.headers.get("location")).toBe(
      "http://hub.test/apphub?notice=access_denied",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("rejects unknown tools without calling Gateway", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await call("unknown");
    expect(response.headers.get("location")).toBe(
      "http://hub.test/apphub?notice=access_denied",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
