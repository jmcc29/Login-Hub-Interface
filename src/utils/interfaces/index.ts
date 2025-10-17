export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any;
}

export interface User {
  name: string;
  username: string;
  email: string;
  identityCard?: string;
  position?: string;
}
