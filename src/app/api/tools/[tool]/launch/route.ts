import { NextRequest, NextResponse } from "next/server";

import { getToolContext } from "@/api/auth/gateway";
import { readWebAuthBffConfig } from "@/utils/auth/config";
import { SID_COOKIE } from "@/utils/auth/cookies";
import { GatewayRequestError } from "@/utils/services/GatewayRequestError";
import { resolveHubTool, toolPublicUrl } from "@/utils/tools";

export const dynamic = "force-dynamic";

function redirectNoStore(destination: URL): NextResponse {
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tool: string }> },
): Promise<NextResponse> {
  const config = readWebAuthBffConfig();
  const tool = resolveHubTool((await context.params).tool);
  if (!tool) {
    return redirectNoStore(
      new URL("/apphub?notice=access_denied", config.hubOrigin),
    );
  }

  const sid = request.cookies.get(SID_COOKIE)?.value;
  if (!sid) {
    return redirectNoStore(
      new URL("/api/auth/session/invalid?returnPath=/apphub", config.hubOrigin),
    );
  }

  try {
    await getToolContext(sid, tool.key);
    return redirectNoStore(toolPublicUrl(tool));
  } catch (error) {
    if (error instanceof GatewayRequestError) {
      if (error.code === "SESSION_INVALID") {
        return redirectNoStore(
          new URL(
            "/api/auth/session/invalid?returnPath=/apphub",
            config.hubOrigin,
          ),
        );
      }
      if (
        error.code === "WEB_CLIENT_ACCESS_DENIED" ||
        error.code === "WEB_TOOL_UNAVAILABLE"
      ) {
        return redirectNoStore(
          new URL("/apphub?notice=access_denied", config.hubOrigin),
        );
      }
    }
    return redirectNoStore(
      new URL("/auth/error?reason=temporarily_unavailable", config.hubOrigin),
    );
  }
}
