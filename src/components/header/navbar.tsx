import { Link } from "@heroui/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@heroui/navbar";

import { UserSession, ThemeSwitch } from "@/components/common";
import { Logo } from "@/components/icons";
import { UserContext } from "@/utils/interfaces";
interface Props {
  context: UserContext;
  environment: string;
  computerToolName: string;
}

export const Navbar = ({ context, environment, computerToolName }: Props) => {
  const { identity, groups, clientRoles } = context;
  const username = identity.preferredUsername ?? identity.sub;
  const name = identity.name ?? username;
  return (
    <NextUINavbar
      isBordered
      className="border-r light:border-gray-200 dark:border-gray-500"
      maxWidth="full"
      position="sticky"
    >
      <NavbarBrand>
        <Link
          aria-label="Ir al inicio"
          className="flex justify-start items-center gap-1"
          href="/apphub"
        >
          <Logo height={30} width={80} />
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <div className="flex flex-col items-center text-center leading-tight">
            <span className="font-bold text-md uppercase">
              {computerToolName}
            </span>
            {(environment === "dev" || environment === "test") && (
              <span className="mt-1 text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-sm shadow-xs shadow-red-300 border border-white/20">
                {environment === "test"
                  ? "VERSIÓN DE PRUEBAS"
                  : "VERSIÓN DE DESARROLLO"}
              </span>
            )}
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <UserSession
          clientRoles={clientRoles}
          email={identity.email}
          groups={groups}
          name={name}
          username={username}
        />
      </NavbarContent>
    </NextUINavbar>
  );
};
