export interface HubTool {
  readonly key: string;
  readonly resource: string;
  readonly name: string;
  readonly subtitle: string;
  readonly image: string;
  readonly publicOriginVariable: string;
  readonly path: string;
}

type Environment = Record<string, string | undefined>;

const tools = Object.freeze([
  Object.freeze({
    key: "beneficiary",
    resource: "beneficiary-interface",
    name: "BENEFICIARIOS",
    subtitle: "HERRAMIENTA TECNOLÓGICA",
    image: "beneficiary.jpg",
    publicOriginVariable: "BENEFICIARY_PUBLIC_ORIGIN",
    path: "/persons",
  }),
  Object.freeze({
    key: "sales",
    resource: "sales-interface",
    name: "VENTAS",
    subtitle: "HERRAMIENTA TECNOLÓGICA",
    image: "sales.png",
    publicOriginVariable: "SALES_PUBLIC_ORIGIN",
    path: "/",
  }),
  Object.freeze({
    key: "collections",
    resource: "collections-interface",
    name: "RECAUDACIONES",
    subtitle: "HERRAMIENTA TECNOLÓGICA",
    image: "collections.png",
    publicOriginVariable: "COLLECTIONS_PUBLIC_ORIGIN",
    path: "/",
  }),
] satisfies readonly HubTool[]);

export function hubTools(): readonly HubTool[] {
  return tools;
}

export function resolveHubTool(key: string): HubTool | undefined {
  return tools.find((tool) => tool.key === key);
}

function publicOrigin(value: string | undefined, name: string): URL {
  try {
    const url = new URL(value || "");
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error();
    }
    return url;
  } catch {
    throw new Error(`${name} must be an HTTP(S) origin without credentials`);
  }
}

export function toolPublicUrl(
  tool: HubTool,
  env: Environment = process.env,
): URL {
  return new URL(
    tool.path,
    publicOrigin(env[tool.publicOriginVariable], tool.publicOriginVariable),
  );
}
