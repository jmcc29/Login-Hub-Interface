import { describe, expect, it } from "vitest";
import { readWebAuthBffConfig } from "./config";

const baseEnv = {
  NODE_ENV: "development",
  GATEWAY_INTERNAL_URL: "http://gateway.test",
  HUB_PUBLIC_ORIGIN: "http://hub.test",
  AUTH_COOKIE_SECURE: "false",
  AUTH_PENDING_TTL_SECONDS: "600",
  AUTH_TOOL_KEY: "hub",
};

describe("web auth BFF configuration", () => {
  it("accepts explicit development origins and cookie policy", () => {
    expect(readWebAuthBffConfig(baseEnv)).toMatchObject({
      secureCookies: false,
      bindingTtlSeconds: 600,
    });
  });

  it.each([
    ["GATEWAY_INTERNAL_URL", "https://user:password@gateway.test"],
    ["GATEWAY_INTERNAL_URL", "https://gateway.test/path"],
    ["HUB_PUBLIC_ORIGIN", "//hub.test"],
  ])("rejects invalid %s values", (name, value) => {
    expect(() => readWebAuthBffConfig({ ...baseEnv, [name]: value })).toThrow();
  });

  it("requires HTTPS and Secure cookies in production by default", () => {
    expect(() =>
      readWebAuthBffConfig({ ...baseEnv, NODE_ENV: "production" }),
    ).toThrow();
    expect(
      readWebAuthBffConfig({
        ...baseEnv,
        NODE_ENV: "production",
        GATEWAY_INTERNAL_URL: "https://gateway.test",
        HUB_PUBLIC_ORIGIN: "https://hub.test",
        AUTH_COOKIE_SECURE: "true",
      }),
    ).toMatchObject({ secureCookies: true });
  });

  it("allows production HTTP only through an explicit override", () => {
    expect(
      readWebAuthBffConfig({
        ...baseEnv,
        NODE_ENV: "production",
        WEB_AUTH_ALLOW_INSECURE_HTTP: "true",
      }),
    ).toMatchObject({ secureCookies: false });
    expect(() =>
      readWebAuthBffConfig({
        ...baseEnv,
        WEB_AUTH_ALLOW_INSECURE_HTTP: "invalid",
      }),
    ).toThrow("WEB_AUTH_ALLOW_INSECURE_HTTP");
  });
});
