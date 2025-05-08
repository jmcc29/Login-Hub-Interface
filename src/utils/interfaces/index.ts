export interface Module {
  id: string;
  name: string;
  urlProd: string;
  urlTest: string;
  urlDev: string;
  urlManual: string;
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

export interface Role {
  id: string;
  name: string;
}
