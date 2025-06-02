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

