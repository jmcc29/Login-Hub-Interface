"use client";
import { AvatarIcon } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";

import { User as UserInterface } from "@/utils/interfaces";
import { apiServerFrontend } from "@/utils/services";

interface Props {
  user: UserInterface;
}

export default function UserComponent({ user }: Props) {

  const handleLogout = async () => {
    await apiServerFrontend.POST("/api/auth/logout",{});
    window.location.href = "/api/auth/login";
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
          <p className="font-bold">Sesión activa{/*como */}</p>
          {/* <p>@Nombre Usuario</p> */}
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          Cerrar Sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
