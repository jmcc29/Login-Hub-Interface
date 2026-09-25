export interface HubTool {
  readonly key: string;
  readonly resource: string;
  readonly name: string;
  readonly subtitle: string;
  readonly image: string;
  readonly port: number;
  readonly path: string;
}

const tools = Object.freeze([
  Object.freeze({
    key: "beneficiary",
    resource: "beneficiary-interface",
    name: "BENEFICIARIOS",
    subtitle: "HERRAMIENTA TECNOLÓGICA",
    image: "beneficiary.jpg",
    port: 3002,
    path: "/persons",
  }),
  Object.freeze({
    key: "sales",
    resource: "sales-interface",
    name: "VENTAS",
    subtitle: "HERRAMIENTA TECNOLÓGICA",
    image: "sales.png",
    port: 3003,
    path: "/",
  }),
  Object.freeze({
    key: "collections",
    resource: "collections-interface",
    name: "RECAUDACIONES",
    subtitle: "HERRAMIENTA TECNOLÓGICA",
    image: "collections.png",
    port: 3004,
    path: "/",
  }),
] satisfies readonly HubTool[]);

export function hubTools(): readonly HubTool[] {
  return tools;
}

export function resolveHubTool(key: string): HubTool | undefined {
  return tools.find((tool) => tool.key === key);
}

export function toolPublicUrl(tool: HubTool): URL {
  const host = process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost";
  if (!/^(?:[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?)$/.test(host)) {
    throw new Error("NEXT_PUBLIC_FRONTEND_HOST is invalid");
  }
  return new URL(tool.path, `http://${host}:${tool.port}`);
}
