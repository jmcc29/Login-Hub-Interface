"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { PermissionsContext } from "@/utils/context/PermissionsContext";
import type { Permission } from "@/utils/interfaces";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  permissions?: Permission[];
}

export function Providers({ children, themeProps, permissions = [] }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider />
      <NextThemesProvider {...themeProps}>
        <PermissionsContext permissions={permissions}>
          {children}
        </PermissionsContext>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
