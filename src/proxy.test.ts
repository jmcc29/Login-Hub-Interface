import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

describe("Hub proxy", () => {
  it.each([
    "/api/auth/login",
    "/api/auth/callback",
    "/auth/error",
    "/_next/static/chunk.js",
    "/favicon.ico",
  ])("does not redirect public infrastructure route %s", async (path) => {
    const response = await proxy(new NextRequest(`http://hub.test${path}`));
    expect(response.headers.get("location")).toBeNull();
  });

  it("starts login for anonymous /apphub access", async () => {
    const response = await proxy(
      new NextRequest("http://hub.test/apphub/reports?page=2"),
    );
    expect(response.headers.get("location")).toBe(
      "http://hub.test/api/auth/login?returnPath=%2Fapphub%2Freports%3Fpage%3D2",
    );
  });

  it("allows the server layout to validate a present SID", async () => {
    const response = await proxy(
      new NextRequest("http://hub.test/apphub", {
        headers: { cookie: `sid=${"s".repeat(43)}` },
      }),
    );
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not treat a similarly prefixed route as /apphub", async () => {
    const response = await proxy(
      new NextRequest("http://hub.test/apphub-other"),
    );
    expect(response.headers.get("location")).toBeNull();
  });
});
