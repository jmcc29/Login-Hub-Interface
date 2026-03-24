import type { Permission } from "@/utils/interfaces";

/** Devuelve true si en perms existe un item con ese rsname y contiene ese scope */
export function canFromList(
  perms: Permission[],
  rsname: string,
  scope: string
): boolean {
  const p = perms.find((x) => x.rsname === rsname);
  return !!p && p.scopes.includes(scope);
}