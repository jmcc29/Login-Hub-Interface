import { Suspense } from "react";

import Software from "@/components/modules/software";
import { getModulesCookie } from "@/utils/helpers/cookies";
export default async function Modules() {
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
        {(modules ?? []).map((module, index) => (
          <Software
            key={index}
            id={module.id}
            image={"mod" + index + ".jpg"}
            name={module.name}
            subtitle={"Herramienta Informática"}
            urlDev={module.urlDev}
            urlManual={module.urlManual}
            urlProd={module.urlProd}
          />
        ))}
      </div>
    </Suspense>
  );
}
