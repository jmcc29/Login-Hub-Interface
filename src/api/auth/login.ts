import { NextResponse } from "next/server";
import { apiClient } from "@/services";

export async function loginAction(
  username: string,
  password: string,
): Promise<NextResponse> {
  try {
    const response = await apiClient.POST("auth/login", {
      username,
      password,
    });
    const statusCode = response.status;

    const responseData = await response.json();
    if (statusCode >= 400) {
      console.log("Response data: ", responseData);

      return NextResponse.json(
        {
          error: true,
          message: responseData.message,
          user: responseData.user,
        },
        { status: statusCode },
      );
    }

    return NextResponse.json(
      {
        error: false,
        message: "Login successful",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: true, message: "Hubo un error en el servicio" },
      { status: 500 },
    );
  }
}