import { APIConnection } from "./APIConnection";

export class FetchService extends APIConnection {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async GET(
    endpoint: string,
    params?: Record<string, string>,
    contentType: string = "application/json",
  ) {
    let url = endpoint;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url += `?${queryParams}`;
    }
    const requestConfig = await this.addInterceptors({ method: "GET" }, contentType);
    return this.handleRequest(url, requestConfig);
  }

  async POST(endpoint: string, body: any, isFormData = false) {
    const headers = isFormData ? null : "application/json";
    const requestConfig = await this.addInterceptors(
      { method: "POST", body: isFormData ? body : JSON.stringify(body) },
      headers,
    );
    return this.handleRequest(endpoint, requestConfig);
  }

  async PUT(endpoint: string, body: any) {
    const requestConfig = await this.addInterceptors(
      { method: "PUT", body: JSON.stringify(body) },
      "application/json",
    );
    return this.handleRequest(endpoint, requestConfig);
  }

  async DELETE(endpoint: string) {
    const requestConfig = await this.addInterceptors({ method: "DELETE" }, "application/json");
    return this.handleRequest(endpoint, requestConfig);
  }
}
