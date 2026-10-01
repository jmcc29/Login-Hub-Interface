"use client";

import { Link, Tooltip } from "@heroui/react";

import { UserSession } from "./userSession";

import { Logo, ThemeSwitch } from "@/components";
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
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <Tooltip delay={0}>
            <Link
              aria-label="Ir al inicio"
              className="flex items-center justify-start gap-1"
              href="/apphub"
            >
              <Logo height={30} width={80} />
            </Link>
            <Tooltip.Content showArrow placement="right">
              <Tooltip.Arrow />
              <p>Ir a inicio</p>
            </Tooltip.Content>
          </Tooltip>
        </div>

        <div className="flex flex-col items-center text-center leading-tight">
          <span className="text-md font-bold uppercase">
            {computerToolName}
          </span>
          {(environment === "dev" || environment === "test") && (
            <span className="mt-1 rounded-sm border border-white/20 bg-red-500 px-2 py-0.5 text-xs font-medium text-white shadow-xs shadow-red-300">
              {environment === "test"
                ? "VERSIÓN DE PRUEBAS"
                : "VERSIÓN DE DESARROLLO"}
            </span>
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeSwitch />
          <div className="hidden md:flex">
            <UserSession
              clientRoles={clientRoles}
              email={identity.email}
              groups={groups}
              logoutUrl="/api/auth/logout"
              name={name}
              username={username}
            />
          </div>
        </div>
      </header>
    </nav>
  );
};
