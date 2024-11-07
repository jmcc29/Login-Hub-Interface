import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {

  const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND || ''
  const port = process.env.LOGIN_FRONTEND_PORT || ''

  try {
    const cookieStore = cookies();
    cookieStore.delete('Set-Cookie'); // Elimina la cookie de sesión
    return new NextResponse("cerrado de sesión exitoso", { status : 200 })
  } catch (e: any) {
    console.error("Ocurrio un error en salir sesión")
    return new NextResponse('Error al cerrar sesión', { status: 500 });
  }
}