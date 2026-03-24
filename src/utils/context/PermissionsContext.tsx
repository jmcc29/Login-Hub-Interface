"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Permission } from "@/utils/interfaces";
import { canFromList } from "@/utils/helpers/permissions";

interface PermissionsContextType {
  permissions: Permission[];
  can: (rsname: string, scope: string) => boolean;
}

const context = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions: Permission[];
}) {
  const value = useMemo(
    () => ({
      permissions,
      can: (r: string, s: string) => canFromList(permissions, r, s),
    }),
    [permissions],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function usePermissions() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error("usePermissions debe usarse dentro de <PermissionsProvider>");
  }
  return ctx;
}