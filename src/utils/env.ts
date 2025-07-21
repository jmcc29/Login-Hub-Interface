export function getDeployEnvironment(): "dev" | "prod" | "test" {
  const env = process.env.NEXT_PUBLIC_DEPLOY_ENV;

  if (env === "prod" || env === "test" || env === "dev") return env;

  return "prod";
}
