import { cookies } from "next/headers";

import { Module } from "@/utils/interfaces/index";

export async function getModules() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("modules")?.value;

  if (!raw) return [];
  try {
    const modules: Module[] = JSON.parse(raw);

    return modules;
  } catch (err) {
    console.error("Error al parsear la cookie 'modules':", err);

    return [];
  }
}
