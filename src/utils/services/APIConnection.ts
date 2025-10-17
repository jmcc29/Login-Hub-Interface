export abstract class APIConnection {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  }

  abstract GET(url: string, options?: any): Promise<Response>;
  abstract POST(url: string, body: any, options?: any): Promise<Response>;
  abstract PUT(url: string, body: any, options?: any): Promise<Response>;
  abstract DELETE(url: string, options?: any): Promise<Response>;

  // ⬇⬇⬇  AHORA ES ASYNC
  protected async addInterceptors(
  requestConfig: RequestInit,
  contentType: string | null = "application/json",
): Promise<RequestInit> {
  // normaliza headers a objeto plano
  const headers: Record<string, string> =
    requestConfig.headers instanceof Headers
      ? Object.fromEntries(requestConfig.headers.entries())
      : (requestConfig.headers as Record<string, string>) || {};

  if (contentType) headers["Content-Type"] = contentType;

  if (typeof window === "undefined") {
    // === SSR ===
    const { headers: nextHeaders } = require("next/headers") as typeof import("next/headers");
    const h = await nextHeaders();

    // Reenvía cookies para que el Gateway vea la sid
    const cookieHeader = h.get("cookie");
    if (cookieHeader) {
      headers["Cookie"] = headers["Cookie"]
        ? `${headers["Cookie"]}; ${cookieHeader}`
        : cookieHeader;
    }

    // Deriva y reenvía ORIGIN (clave para resolver clientId en el Auth-Service)
    // 1) usa el origin entrante si existe
    // 2) si no, construye uno con x-forwarded-proto/host o host
    const proto = h.get("x-forwarded-proto") || "http";
    const host = h.get("x-forwarded-host") || h.get("host") || "";
    const derivedOrigin = host ? `${proto}://${host}` : undefined;
    const origin = h.get("origin") || derivedOrigin;

    if (origin) {
      // En SSR SÍ puedes fijar Origin; en browser no.
      headers["Origin"] = origin;
      // En paralelo, manda cabeceras espejo por si algún proxy pisa Origin
      headers["x-origin"] = origin;
    }

    const referer = h.get("referer") || undefined;
    if (referer) {
      headers["Referer"] = referer;
      headers["x-referer"] = referer;
    }
    // (en SSR no hace falta requestConfig.credentials)
  } else {
    // === Browser ===
    // El navegador enviará la cookie si habilitamos credenciales.
    // Origin/Referer los maneja el navegador automáticamente.
    requestConfig.credentials = "include";
  }

  requestConfig.headers = headers;
  return requestConfig;
}


  protected async handleRequest(endpoint: string, requestConfig: RequestInit): Promise<Response> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, requestConfig);
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      if (contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  }
}
