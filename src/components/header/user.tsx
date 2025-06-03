"use client";
import { AvatarIcon } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";
import { redirect } from "next/navigation";

import { User as UserInterface } from "@/utils/interfaces/index";
import { logout } from "@/api";

interface Props {
  user: UserInterface;
}
export default function UserComponent({ user }: Props) {
  const handleLogout = async () => {
    await logout();
    redirect("/");
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            icon: <AvatarIcon />,
          }}
          className="transition-transform"
          description={user?.username}
          name={user?.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold text-green-700">Sesión activa</p>
          <p>{user?.name}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          <p className="text-red-600">Cerrar Sesión</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
