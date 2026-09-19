import { describe, expect, it } from "vitest";
import { normalizeReturnPath } from "./return-path";

describe("normalizeReturnPath", () => {
  it.each([
    [undefined, "/apphub"],
    ["/apphub", "/apphub"],
    ["/apphub/reports", "/apphub/reports"],
    ["/apphub/reports?page=2", "/apphub/reports?page=2"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeReturnPath(input)).toBe(expected);
  });

  it.each([
    "https://evil.test/apphub",
    "//evil.test/apphub",
    "/apphub\\outside",
    "/apphub#fragment",
    "/outside",
    "/apphub/%2e%2e/outside",
    "/apphub/%2F%2Fevil.test",
    "/apphub/../outside",
  ])("rejects %s", (input) => {
    expect(() => normalizeReturnPath(input)).toThrow("INVALID_RETURN_PATH");
  });
});
