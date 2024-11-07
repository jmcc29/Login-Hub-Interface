"use server";

import { apiClient } from "@/services";

interface Params {
  username: string;
  password: string;
}

export const loginUp = async ({ username, password }: Params): Promise<any> => {
  try {
    const response = await apiClient.POST("api/auth/login", {
      username,
      password,
    });
    return response;
  } catch (e: any) {
    throw e;
  }
};
