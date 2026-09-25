import Software from "@/components/apphub/software";
import { requireUserContext } from "@/utils/auth/session";

export default async function AppHub() {
  const { permissions } = await requireUserContext();
  const allowedToLaunch = new Set(
    permissions
      .filter((permission) => permission.scopes.includes("launch"))
      .map((permission) => permission.resource),
  );
  const tools = [
    {
      resource: "beneficiary-interface",
      name: "BENEFICIARIOS",
      subtitle: "HERRAMIENTA TECNOLÓGICA",
      url: `http://${process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost"}:3002/persons`,
      image: "beneficiary.jpg",
    },
    {
      resource: "sales-interface",
      name: "VENTAS",
      subtitle: "HERRAMIENTA TECNOLÓGICA",
      url: `http://${process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost"}:3003`,
      image: "sales.png",
    },
    {
      resource: "collections-interface",
      name: "RECAUDACIONES",
      subtitle: "HERRAMIENTA TECNOLÓGICA",
      url: `http://${process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost"}:3004`,
      image: "collections.png",
    },
  ].filter((tool) => allowedToLaunch.has(tool.resource));

  return (
    <div className="max-w-full gap-7 grid grid-cols-8 p-5">
      {tools.map((computerTool) => (
        <Software
          key={computerTool.resource}
          image={computerTool.image}
          name={computerTool.name}
          subtitle={computerTool.subtitle}
          url={computerTool.url}
        />
      ))}
      {tools.length === 0 ? (
        <p className="col-span-8 text-center text-default-500">
          No tiene herramientas habilitadas.
        </p>
      ) : null}
    </div>
  );
}
