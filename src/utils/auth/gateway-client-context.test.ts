import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GatewayAuthError, getUserContext } from "./gateway-client";

const sid = "s".repeat(43);
const now = Date.now();
const response = {
  authenticated: true,
  currentTool: "hub",
  currentClient: "hub-interface",
  identity: { sub: "person-1", name: "Hub User" },
  realmRoles: ["realm-user"],
  clientRoles: ["hub-user"],
  groups: ["/staff"],
  permissions: [{ resource: "beneficiary-interface", scopes: ["launch"] }],
  contextExpiresAt: now + 60_000,
  permissionsExpiresAt: now + 60_000,
  sessionExpiresAt: now + 120_000,
  sessionAbsoluteExpiresAt: now + 240_000,
};

describe("Hub user context", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("GATEWAY_INTERNAL_URL", "http://gateway.test");
    vi.stubEnv("HUB_PUBLIC_ORIGIN", "http://hub.test");
    vi.stubEnv("AUTH_COOKIE_SECURE", "false");
    vi.stubEnv("AUTH_PENDING_TTL_SECONDS", "600");
    vi.stubEnv("AUTH_TOOL_KEY", "hub");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("requests the configured primary tool with SID only in the Cookie header", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(getUserContext(sid)).resolves.toEqual(response);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://gateway.test/api/auth/client/context");
    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      Cookie: `sid=${sid}`,
    });
    expect(JSON.parse(String(init?.body))).toEqual({ tool: "hub" });
    expect(String(init?.body)).not.toContain("clientId");
  });

  it("rejects a context for a different tool", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ ...response, currentTool: "beneficiary" }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    await expect(getUserContext(sid)).rejects.toBeInstanceOf(GatewayAuthError);
  });
});
