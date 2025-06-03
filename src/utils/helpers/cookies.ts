import { cookies } from "next/headers";

import { Module, ResponseData } from "@/utils/interfaces/index";
async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name)?.value;

  return cookie;
}

export async function getUserCookie(): Promise<ResponseData> {
  try {
    const raw = await getCookie("user");

    if (!raw) {
      return {
        error: true,
        message: "No se encontró la cookie 'user'",
      };
    }

    return {
      error: false,
      message: "Cookie 'user' obtenida exitosamente",
      data: JSON.parse(raw),
    };
  } catch (error) {
    return {
      error: true,
      message: "Error al parsear la cookie 'user': " + error,
    };
  }
}

export async function getModulesCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("modules")?.value;

  if (!raw) return [];
  try {
    const modules: Module[] = JSON.parse(raw);

    return modules;
  } catch (error) {
    console.error("Error al parsear la cookie 'modules':", error);

    return [];
  }
}

export async function getModIdCookie(moduleId: string): Promise<ResponseData> {
  const nameCookie = `mod_${moduleId}`;

  try {
    const cookie = await getCookie(nameCookie);

    if (!cookie) {
      return {
        error: true,
        message: "No se encontró la cookie del modulo_#",
      };
    }
    const roles = JSON.parse(cookie);

    if (roles.length === 0) {
      return {
        error: true,
        message: `Modulo encontrado exitosamente, pero no tiene roles asignados`,
      };
    }

    return {
      error: false,
      message: `Cookie mod_${nameCookie} obtenida exitosamente`,
      data: roles,
    };
  } catch (error) {
    return {
      error: true,
      message: `Error al encontrar la cookie mod_${nameCookie}:` + error,
    };
  }
}
