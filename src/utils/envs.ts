export function getDeployEnvironment(): "dev" | "prod" | "test" | "local" {
  const env = process.env.NEXT_PUBLIC_DEPLOY_ENV;

  if (env === "prod" || env === "test" || env === "dev" || env === "local")
    return env;

  return "local";
}
export function getLocalUrl(): string {
  const url = process.env.NEXT_PUBLIC_SERVER_FRONTEND + "";

  return url;
}

export function getBackendUrl(): string {
  const url = "http://" + process.env.NEXT_PUBLIC_BACKEND_HOST + ":" + process.env.NEXT_PUBLIC_BACKEND_PORT;
  return url;
}

export function getFrontendUrl(): string {
  const url = "http://" + process.env.NEXT_PUBLIC_SERVER_FRONTEND + ":" + process.env.NEXT_PUBLIC_SERVER_PORT_FRONTEND;
  return url;
}
