import { APIConnection } from "./APIConnection";
import { APIConnectionFactory } from "./APIConnectionFactory";
import { FetchService } from "./FetchService";
import { frontend, backend } from "../env";

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

const baseUrlBackend = backend.url+"/api/";
const baseUrlFrontend = frontend.url;
const factory = new FetchServiceFactory(baseUrlBackend);
const factoryFront = new FetchServiceFactory(baseUrlFrontend);
export const apiClient = factory.createAPIConnection();

export const apiServerFrontend = factoryFront.createAPIConnection();
export const urlFrontHub = frontend.url;