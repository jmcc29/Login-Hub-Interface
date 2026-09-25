"use client";

import { AvatarIcon } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";

interface Props {
  username: string;
  name: string;
  email?: string;
  groups: readonly string[];
  clientRoles: readonly string[];
}

const badges = (values: readonly string[], emptyLabel: string) =>
  values.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <span
          key={value}
          className="max-w-full truncate rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200"
          title={value}
        >
          {value}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-xs text-default-400">{emptyLabel}</p>
  );

export const UserSession = ({
  username,
  name,
  email,
  groups,
  clientRoles,
}: Props) => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{ isBordered: true, icon: <AvatarIcon /> }}
          className="transition-transform"
          description={username}
          name={name}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Información de la sesión"
        className="w-80"
        variant="flat"
      >
        <DropdownItem
          key="profile"
          isReadOnly
          className="cursor-default py-3"
          textValue="Perfil del usuario"
        >
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <p className="font-semibold text-green-700 dark:text-green-400">
                Sesión activa
              </p>
            </div>
            <p className="truncate font-medium text-foreground" title={name}>
              {name}
            </p>
            <p className="truncate text-xs text-default-500" title={username}>
              @{username}
            </p>
            <p className="truncate text-xs text-default-500" title={email}>
              {email ?? "Correo no registrado"}
            </p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="groups"
          isReadOnly
          className="cursor-default py-3"
          textValue="Grupos del usuario"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-default-500">
              Grupos
            </p>
            {badges(groups, "Sin grupos asignados")}
          </div>
        </DropdownItem>
        <DropdownItem
          key="roles"
          isReadOnly
          className="cursor-default py-3"
          textValue="Roles de la herramienta"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-default-500">
              Roles de la herramienta
            </p>
            {badges(clientRoles, "Sin roles asignados")}
          </div>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" href="/api/auth/logout">
          Cerrar Sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
