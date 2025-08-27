// src/utils/services/FetchService.ts
import { APIConnection } from "./APIConnection";

export class FetchService extends APIConnection {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async GET(endpoint: string, params?: Record<string, string>): Promise<Response> {
    let url = endpoint;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }
    const requestConfig = this.addInterceptors({ method: "GET" });
    return this.handleRequest(url, requestConfig);
  }

  async POST(endpoint: string, body: any, options?: RequestInit): Promise<Response> {
    const requestConfig = this.addInterceptors({
      method: "POST",
      body: JSON.stringify(body),
      ...(options || {}),
    });
    return this.handleRequest(endpoint, requestConfig);
  }

  async PUT(endpoint: string, body: any, options?: RequestInit): Promise<Response> {
    const requestConfig = this.addInterceptors({
      method: "PUT",
      body: JSON.stringify(body),
      ...(options || {}),
    });
    return this.handleRequest(endpoint, requestConfig);
  }

  async DELETE(endpoint: string, options?: RequestInit): Promise<Response> {
    const requestConfig = this.addInterceptors({
      method: "DELETE",
      ...(options || {}),
    });
    return this.handleRequest(endpoint, requestConfig);
  }
}
