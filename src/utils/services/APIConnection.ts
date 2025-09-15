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
      // SSR: copia el header Cookie de la request entrante y reenvíalo
      const { headers: nextHeaders } = require("next/headers") as typeof import("next/headers");
      const cookieHeader = (await nextHeaders()).get("cookie"); // <-- ahora sí con await
      if (cookieHeader) {
        headers["Cookie"] = headers["Cookie"]
          ? `${headers["Cookie"]}; ${cookieHeader}`
          : cookieHeader;
      }
      // (en SSR no hace falta requestConfig.credentials)
    } else {
      // Cliente: el navegador enviará la cookie si habilitamos credenciales
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
