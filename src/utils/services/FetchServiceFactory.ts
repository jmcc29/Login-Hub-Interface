// src/utils/services/FetchServiceFactory.ts
import { APIConnection } from "./APIConnection";
import { APIConnectionFactory } from "./APIConnectionFactory";
import { FetchService } from "./FetchService";
export class FetchServiceFactory extends APIConnectionFactory {
  constructor(private baseUrl: string) {
    super();
  }
  public createAPIConnection(): APIConnection {
    return new FetchService(this.baseUrl);
  }
}
// 👇 Cliente que usará el navegador: siempre same-origin hacia Next (/api)
export const apiClient = new FetchServiceFactory("/api/").createAPIConnection();