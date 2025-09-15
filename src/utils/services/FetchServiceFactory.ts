import { APIConnection } from "./APIConnection";
import { APIConnectionFactory } from "./APIConnectionFactory";
import { FetchService } from "./FetchService";
import { getFrontendUrl, getBackendUrl } from "../env";

export class FetchServiceFactory extends APIConnectionFactory {
  private baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  public createAPIConnection(): APIConnection {
    return new FetchService(this.baseUrl);
  }
}

const baseUrlBackend = getBackendUrl()+"/api/";
const baseUrlFrontend = getFrontendUrl();
const factory = new FetchServiceFactory(baseUrlBackend);
const factoryFront = new FetchServiceFactory(baseUrlFrontend);
export const apiClient = factory.createAPIConnection();

export const apiServerFrontend = factoryFront.createAPIConnection();
export const urlLogin = getFrontendUrl();