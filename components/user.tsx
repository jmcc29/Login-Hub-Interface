"use client";
import { apiServerFrontend } from "@/services";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";

export default function UserComponent () {

  const handleLogout = async () => {
    const response = await apiServerFrontend.POST('/api/logout', {
    })
    console.log(response)
    if(response.ok) {
      window.location.reload();
    }
  }

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
          Salir sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}