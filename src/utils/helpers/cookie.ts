"use server";

import { cookies } from "next/headers";

import { ResponseData, User } from "@/utils/interfaces";

export async function getCookie(nameCookie: string): Promise<any> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(nameCookie);

  if (!cookie) {
    return undefined;
  }

  return cookie.value;
}

export async function getProfileCookie(): Promise<ResponseData> {
  try {
    const cookie = await getCookie("profile");

    if (!cookie) {
      return {
        error: true,
        message: "No se encontró la cookie 'profile'",
      };
    }
    console.log("Cookie 'profile' encontrada:", cookie); // Debug: Verificar el valor de la cookie en la consola
    return {
      error: false,
      message: "Cookie 'profile' obtenida exitosamente",
      data: JSON.parse(cookie),
    };
  } catch (error) {
    return {
      error: true,
      message: "Error al obtener la cookie 'profile': " + error,
    };
  }
}
