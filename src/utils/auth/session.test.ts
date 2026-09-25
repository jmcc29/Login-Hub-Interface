import { describe, expect, it, vi } from "vitest";
import { GatewayAuthError } from "@/api/auth/gateway";
import {
  evaluateWebSession,
  invalidSessionRedirectPath,
} from "./session-decision";

describe("evaluateWebSession", () => {
  it("routes invalid sessions through localized cookie cleanup", () => {
    expect(invalidSessionRedirectPath()).toBe(
      "/api/auth/session/invalid?returnPath=/apphub",
    );
  });

  it("accepts a server-validated session", async () => {
    const checker = vi.fn().mockResolvedValue({
      authenticated: true,
      identity: { sub: "person-1" },
      sessionExpiresAt: Date.now() + 60_000,
    });
    await expect(evaluateWebSession("sid", checker)).resolves.toEqual({
      kind: "authenticated",
      identity: { sub: "person-1" },
    });
  });

  it("treats an absent or invalid SID as unauthenticated", async () => {
    await expect(evaluateWebSession(undefined)).resolves.toEqual({
      kind: "invalid",
    });
    const checker = vi
      .fn()
      .mockRejectedValue(new GatewayAuthError("SESSION_INVALID"));
    await expect(evaluateWebSession("sid", checker)).resolves.toEqual({
      kind: "invalid",
    });
  });

  it("keeps service unavailability distinct from an invalid session", async () => {
    const checker = vi
      .fn()
      .mockRejectedValue(new GatewayAuthError("AUTH_SERVICE_UNAVAILABLE"));
    await expect(evaluateWebSession("sid", checker)).resolves.toEqual({
      kind: "unavailable",
    });
  });
});
