"use client";
import { Button } from "@heroui/button";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";

interface SoftwareProps {
  name: string;
  subtitle: string;
  url: string;
  image: string;
}

export default function Software(props: SoftwareProps) {
  const { name, subtitle, url, image } = props;

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
        src={image}
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t border-zinc-100/50 z-10 justify-between gap-2">
        <Button
          showAnchorIcon
          aria-label="Link"
          as={Link}
          className="bg-white/90 min-w-10 text-lg w-full"
          size="md"
          onPress={() => {
            window.location.href = url;
          }}
        >
          Ingresar{" "}
        </Button>
      </CardFooter>
    </Card>
  );
}
