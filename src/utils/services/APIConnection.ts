// src/utils/services/APIConnection.ts
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

  protected addInterceptors(requestConfig: RequestInit): RequestInit {
    const headers = new Headers(requestConfig.headers || {});
    if (!headers.has("Content-Type") && requestConfig.body) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");

    return {
      ...requestConfig,
      headers,
      credentials: "include", // ← importante para enviar cookies al BFF (/api)
      cache: "no-store",
    };
  }

  protected async handleRequest(
    endpoint: string,
    requestConfig: RequestInit,
  ): Promise<Response> {
    const url = this.buildUrl(endpoint);
    return fetch(url, requestConfig);
  }
}
