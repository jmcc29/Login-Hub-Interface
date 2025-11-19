"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/utils/services";

export async function tokenStatus(clientId: string): Promise<{
  exists: boolean;
  valid: boolean;
}> {
  try {
    const sid = (await cookies()).get("sid")?.value;

    if (!sid) {
      return { exists: false, valid: false };
    }

    const res = await apiClient.GET("auth/token/verify", {
      clientId,
      // Si quisieras agregar clockSkewSec o checkAzp:
      // clockSkewSec: 120,
      // checkAzp: true,
    });

    // Tu apiClient devuelve una Response, así que parseamos JSON
    const data = await res.json();

    return {
      exists: data.exists === true,
      valid: data.isValid === true,
    };
  } catch {
    // Fallback robusto: si algo falla, considéralo inválido.
    return { exists: false, valid: false };
  }
}
