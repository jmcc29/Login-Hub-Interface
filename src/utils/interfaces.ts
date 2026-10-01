export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any;
}

export interface PresentationIdentity {
  sub: string;
  preferredUsername?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
}

export interface ResourcePermission {
  resource: string;
  scopes: string[];
}

export interface UserContext {
  authenticated: true;
  currentTool: string;
  currentClient: string;
  identity: PresentationIdentity;
  realmRoles: string[];
  clientRoles: string[];
  groups: string[];
  permissions: ResourcePermission[];
  contextExpiresAt: number;
  permissionsExpiresAt: number;
  sessionExpiresAt: number;
  sessionAbsoluteExpiresAt: number;
}

export interface ExchangeResponse {
  sid: string;
  returnPath: string;
  identity: PresentationIdentity;
  sessionExpiresAt: number;
  sessionAbsoluteExpiresAt: number;
}

export interface SessionCheckResponse {
  authenticated: true;
  identity: PresentationIdentity;
  sessionExpiresAt: number;
}
