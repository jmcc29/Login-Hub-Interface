export function getDeployEnvironment(): "dev" | "prod" | "test" {
  const env = process.env.NEXT_PUBLIC_DEPLOY_ENV;

  if (env === "prod" || env === "test" || env === "dev") return env;

  return "prod";
}

export const backend = {
  host: process.env.NEXT_PUBLIC_BACKEND_HOST,
  port: process.env.NEXT_PUBLIC_BACKEND_PORT,
  url: `http://${process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost"}:${process.env.NEXT_PUBLIC_BACKEND_PORT || "3000"}`,
};

export const frontend = {
  host: process.env.NEXT_PUBLIC_HUB_FRONTEND_HOST,
  port: process.env.NEXT_PUBLIC_HUB_FRONTEND_PORT,
  url: `http://${process.env.NEXT_PUBLIC_HUB_FRONTEND_HOST || "localhost"}:${process.env.NEXT_PUBLIC_HUB_FRONTEND_PORT || "3001"}`,
  clientId: process.env.NEXT_PUBLIC_HUB_CLIENT_ID || "hub-interface",
};

export const externalFrontends = {
  beneficiary: {
    host: process.env.NEXT_PUBLIC_BENEFICIARY_FRONTEND_HOST,
    port: process.env.NEXT_PUBLIC_BENEFICIARY_FRONTEND_PORT,
    url: `http://${process.env.NEXT_PUBLIC_BENEFICIARY_FRONTEND_HOST || "localhost"}:${process.env.NEXT_PUBLIC_BENEFICIARY_FRONTEND_PORT || "3002"}`,
    clientId:
      process.env.NEXT_PUBLIC_CLIENT_ID_BENEFICIARY || "beneficiary-interface",
  },
};
