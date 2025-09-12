export function getDeployEnvironment(): "dev" | "prod" | "test" {
  const env = process.env.NEXT_PUBLIC_DEPLOY_ENV;

  if (env === "prod" || env === "test" || env === "dev") return env;

  return "prod";
}

export function getBackendUrl(): string {
  const url = "http://" + process.env.NEXT_PUBLIC_BACKEND_HOST + ":" + process.env.NEXT_PUBLIC_BACKEND_PORT;
  return url;
}

export function getFrontendUrl(): string {
  const url = "http://" + process.env.NEXT_PUBLIC_SERVER_FRONTEND + ":" + process.env.NEXT_PUBLIC_SERVER_PORT_FRONTEND;
  return url;
}
