"use client";

import { Button, Card } from "@heroui/react";
import Image from "next/image";

interface Props {
  name: string;
  url: string;
  image: string;
  description: string;
}

export default function Software({ name, url, image, description }: Props) {
  return (
    <Card className="relative flex h-full w-full max-w-md flex-col overflow-hidden border border-accent/20 bg-linear-to-br from-accent/12 via-surface to-surface-secondary shadow-lg shadow-accent/10 dark:border-accent/30 dark:from-accent/20 dark:via-surface dark:to-accent/8 dark:shadow-accent/5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-accent/20 blur-3xl dark:bg-accent/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-accent/10 blur-2xl dark:bg-accent/20"
      />
      <Card.Header className="relative flex-1 gap-3">
        <span className="text-emerald-700 w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xl font-black tracking-wide dark:bg-accent/25 dark:text-green-400">
          {name}
        </span>
        <div className="flex items-start gap-3">
          <Image
            alt="Card example background"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-soft-foreground"
            height={100}
            src={image}
            width={100}
          />
          <div className="flex flex-col gap-1 font-semibold">
            <Card.Description>{description}</Card.Description>
          </div>
        </div>
      </Card.Header>
      <Card.Footer className="relative mt-auto flex-col gap-2 sm:flex-row">
        <Button
          aria-label="Link"
          className="w-full shadow-md shadow-accent/20 uppercase border-3 font-bold"
          size="md"
          variant="secondary"
          onPress={() => {
            window.location.href = url;
          }}
        >
          Ingresar{" "}
        </Button>
      </Card.Footer>
    </Card>
  );
}
