import { Navbar } from "@/components/header/navbar";
import { getUserCookie } from "@/utils/cookie";
import { getDeployEnvironment } from "@/utils/env";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await getUserCookie();
  const environment = getDeployEnvironment();
  const computerToolName = "HERRAMIENTA TECNOLÓGICA DE TRÁMITES";

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        computerToolName={computerToolName}
        environment={environment}
        user={data}
      />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-neutral-950">
        <section className="flex flex-col flex-wrap h-[calc(100vh-110px)]">
          {children}
        </section>
      </main>
    </div>
  );
}
