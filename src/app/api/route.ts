import { NextResponse } from "next/server";

import { apiClient } from "@/services";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const response = await apiClient.POST("auth/login", {
      username,
      password,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: true,
          message: responseData.message,
          user: responseData.user,
        },
        { status: response.status },
      );
    }

    if (responseData.error) {
      return NextResponse.json(
        {
          error: true,
          message: responseData.message,
          user: responseData.user,
        },
        { status: 400 },
      );
    }

    const nextResponse = NextResponse.json(
      {
        error: false,
        message: "Inicio de sesión exitoso",
        user: responseData.user,
        access: responseData.access,
      },
      { status: 200 },
    );

    nextResponse.headers.set(
      "Set-Cookie",
      response.headers.get("Set-Cookie") || "",
    );

    return nextResponse;
  } catch {
    return NextResponse.json(
      { error: true, message: "Hubo un error en el servicio" },
      { status: 500 },
    );
  }
}
