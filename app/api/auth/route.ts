import { apiClient } from "@/services";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  try {
    const response = await apiClient.POST("api/auth/login", {
      username,
      password,
    }); // Realizamos la petición
    const statusCode = response.status; // obtenemos su código de estado

    if (statusCode >= 500) {
      return NextResponse.json(
        {
          error: true,
          message: "Hubo un error en el servicio.",
        },
        { status: statusCode },
      );
    }

    const responseData = await response.json();

    if (statusCode >= 400) {
      return NextResponse.json(
        {
          error: true,
          message: responseData.message,
        },
        { status: statusCode },
      );
    }

    const setCookieHeader = response.headers.get("cookie") || "";

    if (!setCookieHeader) {
      return NextResponse.json(
        {
          error: true,
          message: responseData.message,
        },
        { status: 400 },
      );
    }
    const nextResponse = NextResponse.json(
      {
        error: false,
        message: "Login successful",
      },
      { status: 200 },
    );

    nextResponse.headers.set("Set-Cookie", setCookieHeader);
    return nextResponse;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 },
    );
  }
}
