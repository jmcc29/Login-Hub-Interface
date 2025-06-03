"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { apiClient } from "@/utils/services";
export async function logout() {
  try {
    await apiClient.GET("auth/logout");

    const cookieStore = await cookies();

    cookieStore.delete("msp");
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: true, message: "Hubo un error en el servicio" },
      { status: 500 },
    );
  }
}
