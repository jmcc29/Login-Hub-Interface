import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/utils/services";

export async function POST(req: NextRequest) {
  const sid = (await cookies()).get("sid")?.value;
  if (sid) {
    try {
      await apiClient.POST(
        "auth/logout",
        {},
        {
          headers: { Cookie: `sid=${sid}` },
        }
      );
    } catch (e) {
      console.warn("backend logout failed:", e);
      console.warn("backend logout failed:", (e as any)?.message);
    }
  }
  (await cookies()).delete("sid");
  return new Response(null, { status: 204 });
}
