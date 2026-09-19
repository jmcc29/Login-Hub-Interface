import { describe, expect, it } from "vitest";
import {
  bindingCookie,
  clearBindingCookie,
  profileCookie,
  sessionMaxAge,
  sidCookie,
} from "./cookies";
import { WebAuthBffConfig } from "./config";

const config = {
  secureCookies: true,
  bindingTtlSeconds: 600,
} as WebAuthBffConfig;

describe("web auth cookies", () => {
  it("sets the temporary binding cookie and deletes it with the same path", () => {
    expect(bindingCookie("binding", config)).toMatchObject({
      name: "oidc_binding",
      value: "binding",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/api/auth",
      maxAge: 600,
    });
    expect(clearBindingCookie(config)).toMatchObject({
      name: "oidc_binding",
      path: "/api/auth",
      maxAge: 0,
    });
  });

  it("converts the millisecond epoch expiry to remaining whole seconds", () => {
    expect(sessionMaxAge(1_120_999, 1_000_000)).toBe(120);
    expect(() => sessionMaxAge(999, 1_000)).toThrow();
  });

  it("creates opaque session and presentation-only profile cookies", () => {
    expect(sidCookie("sid", 120, config)).toMatchObject({
      name: "sid",
      value: "sid",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 120,
    });
    const profile = profileCookie(
      { sub: "person-1", name: "Person" },
      120,
      config,
    );
    expect(JSON.parse(profile.value)).toEqual({
      sub: "person-1",
      name: "Person",
    });
    expect(profile.value).not.toContain("token");
  });
});
