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

    const nextResponse = NextResponse.json(
      {
        error: false,
        message: "Login successful",
      },
      { status: 200 },
    );

    nextResponse.headers.set("Set-Cookie", response.headers.get("Set-Cookie") || "");

    return nextResponse;

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: true, message: "Hubo un error en el servicio" },
      { status: 500 },
    );
  }
}
