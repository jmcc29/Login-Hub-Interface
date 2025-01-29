import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("msp"); // Elimina la cookie de sesión
    return new NextResponse("cerrado de sesión exitoso", { status: 200 });
  } catch (e: any) {
    console.error("Ocurrio un error en salir sesión");
    return new NextResponse("Error al cerrar sesión", { status: 500 });
  }
}
