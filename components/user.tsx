"use client";
import { AvatarIcon } from "@heroui/avatar";
import { User } from "@heroui/user";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import { apiServerFrontend } from "@/services";

export default function UserComponent() {
  const handleLogout = async () => {
    const response = await apiServerFrontend.POST("/api/logout", {});

    if (response.ok) {
      window.location.reload();
    }
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
          description="@opciones"
          name="@Nombre Usuario"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold">Iniciado sesión como</p>
          <p>@Nombre Usuario</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
