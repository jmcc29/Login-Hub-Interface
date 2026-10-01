"use client";

import { Button, Card } from "@heroui/react";
import Image from "next/image";

interface Props {
  name: string;
  description: string;
  url: string;
  image: string;
}

export default function Software({ name, description, url, image }: Props) {
  return (
    <Card className="relative flex h-full w-full max-w-md flex-col overflow-hidden border border-accent/20 bg-linear-to-br from-accent/12 via-surface to-surface-secondary shadow-lg shadow-accent/10 dark:border-accent/30 dark:from-accent/20 dark:via-surface dark:to-accent/8 dark:shadow-accent/5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-accent/20 blur-3xl dark:bg-accent/30"
      />
      <Card.Header className="relative flex-1 gap-3">
        <span className="w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xl font-black tracking-wide text-emerald-700 dark:bg-accent/25 dark:text-green-400">
          {name}
        </span>
        <div className="flex items-start gap-3">
          <Image
            alt={name}
            className="size-24 shrink-0 rounded-xl object-contain"
            height={100}
            src={image}
            width={100}
          />
          <Card.Description>{description}</Card.Description>
        </div>
      </Card.Header>
      <Card.Footer className="relative mt-auto">
        <Button
          className="w-full border-3 font-bold uppercase shadow-md shadow-accent/20"
          size="md"
          variant="secondary"
          onPress={() => {
            window.location.href = url;
          }}
        >
          Ingresar
        </Button>
      </Card.Footer>
    </Card>
  );
}
