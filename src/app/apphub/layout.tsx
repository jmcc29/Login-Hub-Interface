import { Navbar } from "@/components/header/navbar";
import { getDeployEnvironment, frontend } from "@/utils/env";
import { getProfileCookie, getCookie } from "@/utils/helpers/cookie";
import { getPermissions } from "@/api";
import { PermissionsProvider } from "@/utils/context/PermissionsContext";
import { Permission } from "@/utils/interfaces";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: profileData } = await getProfileCookie();
  const sid = await getCookie("sid");
  const clientId = frontend.clientId;
  console.log("Profile data:", profileData); // Debug: Verificar datos del perfil en la consola

  const environment = getDeployEnvironment();
  const computerToolName = "HERRAMIENTA TECNOLÓGICA DE TRÁMITES";

  let permissions: Permission[] = [];
  if (sid) {
    try {
      permissions = await getPermissions(clientId);
    } catch {
      console.warn("Error fetching permissions");
    }
  }

  return (
    <PermissionsProvider permissions={permissions}>
      <div className="flex flex-col h-screen">
        <Navbar
          computerToolName={computerToolName}
          environment={environment}
          user={profileData}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-neutral-950">
          <section className="flex flex-col flex-wrap h-[calc(100vh-110px)]">
            {children}
          </section>
        </main>
      </div>
    </PermissionsProvider>
  );
}
