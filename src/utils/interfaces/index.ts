import { ModulePartial } from "../types";
export interface Module {
  id: string;
  name: string;
  urlProd: string;
  urlTest: string;
  urlDev: string;
  urlManual: string;
}
export interface Software extends ModulePartial {
  subtitle: string;
  image: string;
}
export interface User {
  id: string;
  name: string;
  username: string;
  identityCard?: string;
  position?: string;
}

export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any;
}

export interface Rol {
  id: string;
  name: string;
}

export interface ModuleRoles extends Module {
  roles: Rol[];
}
