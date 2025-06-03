import { CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

import { Rol } from "@/utils/interfaces";

interface Props {
  rol: Rol;
}
export const RolInfo = ({ rol }: Props) => {
  return (
    <>
      <CardBody className="overflow-visible p-0">
        <Image
          alt={rol.name}
          className="w-full object-cover h-[100px]"
          radius="lg"
          shadow="sm"
          //src={"/r" + rol.id+ ".png"}
          width="100%"
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <p className="text-default-500">Rol:</p>
        <b className="uppercase">{rol.name}</b>
      </CardFooter>
    </>
  );
};
