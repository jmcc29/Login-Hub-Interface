"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Select, SelectItem } from "@heroui/select";
import { Link } from "@heroui/link";

interface SoftwareProps {
  name: string;
  subtitle: string;
  urlProd: string;
  urlDev: string;
  urlManual: string;
  image: string;
}

export default function Software(props: SoftwareProps) {
  const { name, subtitle, urlProd, urlDev, urlManual, image } = props;
  const [selectedKey, setSelectedKey] = useState<string>("prod");

  const handleExternalRedirect = () => {
    let url = "";

    switch (selectedKey) {
      case "prod":
        url = urlProd;
        break;
      case "dev":
        url = urlDev;
        break;
      case "manual":
        url = urlManual;
        break;
      default:
        return;
    }
    window.location.href = url;
  };

  return (
    <Card
      isFooterBlurred
      className="w-full h-[300px] col-span-12 sm:col-span-2"
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-black/60 uppercase font-bold">
          {subtitle}
        </p>
        <h4 className="text-black font-medium text-2xl">{name}</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src={"/" + image}
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t border-zinc-100/50 z-10 justify-between gap-2">
        <Select
          aria-label="Select"
          className="max-w-xs"
          labelPlacement="outside"
          placeholder="Elegir"
          selectedKeys={[selectedKey]}
          onSelectionChange={(keys) =>
            setSelectedKey(Array.from(keys)[0] as string)
          }
        >
          <SelectItem key="prod">Producción</SelectItem>
          <SelectItem key="dev">Desarrollo</SelectItem>
          {/* <SelectItem key="manual">Manual</SelectItem> */}
        </Select>
        <Button
          showAnchorIcon
          aria-label="Link"
          as={Link}
          className="bg-white/90 min-w-10 text-lg"
          size="md"
          onPress={handleExternalRedirect}
        />
      </CardFooter>
    </Card>
  );
}
