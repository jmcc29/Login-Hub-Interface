export interface WebAuthBffConfig {
  gatewayUrl: URL;
  hubOrigin: URL;
  secureCookies: boolean;
  bindingTtlSeconds: number;
  toolKey: string;
}

type Environment = Record<string, string | undefined>;

function origin(value: string | undefined, name: string): URL {
  try {
    const url = new URL(value || "");
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error();
    }
    return url;
  } catch {
    throw new Error(`${name} must be an HTTP(S) origin without credentials`);
  }
}

export function readWebAuthBffConfig(
  env: Environment = process.env,
): WebAuthBffConfig {
  const gatewayUrl = origin(env.GATEWAY_INTERNAL_URL, "GATEWAY_INTERNAL_URL");
  const hubOrigin = origin(env.HUB_PUBLIC_ORIGIN, "HUB_PUBLIC_ORIGIN");
  if (env.AUTH_COOKIE_SECURE !== "true" && env.AUTH_COOKIE_SECURE !== "false") {
    throw new Error("AUTH_COOKIE_SECURE must be true or false");
  }
  const secureCookies = env.AUTH_COOKIE_SECURE === "true";
  if (env.NODE_ENV === "production" && !secureCookies) {
    throw new Error("AUTH_COOKIE_SECURE must be true in production");
  }
  if (
    env.NODE_ENV === "production" &&
    (gatewayUrl.protocol !== "https:" || hubOrigin.protocol !== "https:")
  ) {
    throw new Error("Web authentication URLs must use HTTPS in production");
  }
  const toolKey = env.AUTH_TOOL_KEY;
  if (!toolKey || !/^[a-z][a-z0-9-]{0,63}$/.test(toolKey)) {
    throw new Error("AUTH_TOOL_KEY is invalid");
  }
  const bindingTtlSeconds = Number(env.AUTH_PENDING_TTL_SECONDS || "600");
  if (
    !Number.isSafeInteger(bindingTtlSeconds) ||
    bindingTtlSeconds < 1 ||
    bindingTtlSeconds > 600
  ) {
    throw new Error("AUTH_PENDING_TTL_SECONDS must be between 1 and 600");
  }
  return { gatewayUrl, hubOrigin, secureCookies, bindingTtlSeconds, toolKey };
}
