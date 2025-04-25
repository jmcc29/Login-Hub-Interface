import { cookies } from "next/headers";

import { Module, ResponseData, User } from "@/utils/interfaces/index";
import { error } from "console";
async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name)?.value;
  return cookie;
}
function parseCookie(raw: string) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error al parsear la cookie:", error);
    return null;
  }
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
