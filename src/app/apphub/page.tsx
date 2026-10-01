import { AccessNotice } from "@/components/apphub/accessNotice";
import Software from "@/components/apphub/software";
import { requireUserContext } from "@/utils/auth/session";
import { hubTools } from "@/utils/tools";

interface Props {
  searchParams: Promise<{ notice?: string }>;
}

export default async function AppHub({ searchParams }: Props) {
  const [{ permissions }, query] = await Promise.all([
    requireUserContext(),
    searchParams,
  ]);
  const allowedToLaunch = new Set(
    permissions
      .filter((permission) => permission.scopes.includes("launch"))
      .map((permission) => permission.resource),
  );
  const tools = hubTools().filter((tool) => allowedToLaunch.has(tool.resource));

  return (
    <div className="max-w-full p-5">
      {query.notice === "access_denied" ? <AccessNotice /> : null}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Software
            key={tool.resource}
            description={tool.subtitle}
            image={`/${tool.image}`}
            name={tool.name}
            url={`/api/tools/${tool.key}/launch`}
          />
        ))}
        {tools.length === 0 ? (
          <p className="text-center text-muted sm:col-span-2 lg:col-span-3">
            No tiene herramientas habilitadas.
          </p>
        ) : null}
      </div>
    </div>
  );
}
