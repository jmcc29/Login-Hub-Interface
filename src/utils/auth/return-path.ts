function hasControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    if (code < 32 || code === 127) return true;
  }

  return false;
}

export function normalizeReturnPath(value: string | null | undefined): string {
  const candidate = value || "/apphub";
  if (
    candidate.length > 2048 ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    candidate.includes("#") ||
    hasControlCharacter(candidate)
  ) {
    throw new Error("INVALID_RETURN_PATH");
  }
  const separator = candidate.indexOf("?");
  const rawPath = separator === -1 ? candidate : candidate.slice(0, separator);
  if (rawPath.includes("%") || rawPath.includes("//")) {
    throw new Error("INVALID_RETURN_PATH");
  }
  const parsed = new URL(candidate, "https://hub.invalid");
  if (
    parsed.origin !== "https://hub.invalid" ||
    (parsed.pathname !== "/apphub" &&
      !parsed.pathname.startsWith("/apphub/")) ||
    parsed.hash
  ) {
    throw new Error("INVALID_RETURN_PATH");
  }
  return `${parsed.pathname}${parsed.search}`;
}
