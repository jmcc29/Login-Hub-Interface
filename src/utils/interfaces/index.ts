export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any;
}

export interface User {
  name: string;
  username: string;
  givenName: string;
  familyName: string;
  email: string;
  roles: string[];
}

export interface Permission {
  scopes: string[];
  rsid: string;
  rsname: string;
}
