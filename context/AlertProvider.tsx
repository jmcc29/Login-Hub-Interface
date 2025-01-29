"use client";

import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

interface FullScreenProviderContextType {
  children: ReactNode;
}

export default function AlertProvider({
  children,
}: FullScreenProviderContextType) {
  // @ts-ignore
  return <SnackbarProvider maxSnack={1}>{children}</SnackbarProvider>;
}
