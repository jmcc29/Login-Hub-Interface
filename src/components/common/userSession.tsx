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

const badges = (values: readonly string[]) => (
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
);

export const UserSession = ({
  username,
  name,
  email,
  groups,
  clientRoles,
}: Props) => {
  const visibleRoles = clientRoles.filter((role) => role !== "user");

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
        {groups.length > 0 ? (
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
              {badges(groups)}
            </div>
          </DropdownItem>
        ) : null}
        {visibleRoles.length > 0 ? (
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
              {badges(visibleRoles)}
            </div>
          </DropdownItem>
        ) : null}
        <DropdownItem key="logout" color="danger" href="/api/auth/logout">
          Cerrar Sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
