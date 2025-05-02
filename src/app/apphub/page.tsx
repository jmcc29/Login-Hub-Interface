import { Suspense } from "react";
import Software from "@/components/apphub/software";
import { getModulesCookie } from "@/utils/helpers/cookies";
export default async function AppHub() {
  const modules = await getModulesCookie();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <div className="max-w-full gap-7 grid grid-cols-8 px-10 py-5">
        {(modules ?? []).map((modules, index) => (
          <Software
            key={index}
            image={"mod" + index + ".jpg"}
            name={modules.name}
            subtitle={"Herramienta Informática"}
            urlDev={modules.urlDev}
            urlManual={modules.urlManual}
            urlProd={modules.urlProd}
          />
        ))}
      </div>
    </Suspense>
  );
}
