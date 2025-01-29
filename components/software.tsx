"use client";
import { Button } from "@heroui/button";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";

interface SoftwareProps {
  name: string;
  subtitle: string;
  url: string;
  image?: string;
}

export default function Software(props: SoftwareProps) {
  const { name, subtitle, url, image } = props;

  const handleExternalRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <Card
      isFooterBlurred
      className="w-full h-[300px] col-span-12 sm:col-span-2"
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">
          {subtitle}
        </p>
        <h4 className="text-black font-medium text-2xl">{name}</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src={ image ?? "https://nextui.org/images/card-example-6.jpeg" }
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <Button
          onClick={() => handleExternalRedirect(url)}
          className="text-tiny bg-lime-700 text-white font-bold"
          radius="sm"
          size="sm"
        >
          Producción
        </Button>
        <Button
          className="text-tiny bg-gray-700 text-white font-bold"
          radius="sm"
          size="sm"
        >
          Versión de Pruebas
        </Button>
      </CardFooter>
    </Card>
  );
}
