import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const redirectTo = (req: NextRequest, pathname: string) => {
  const url = req.nextUrl.clone();

  url.pathname = pathname;

  return NextResponse.redirect(url);
};

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next();

  if (req.method === "OPTIONS") {
    return response;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("msp")?.value;
  const path = req.nextUrl.pathname;

  try {
    if (path === "/") {
      return token ? redirectTo(req, "/modules") : redirectTo(req, "/login");
    }

    if (path === "/login") {
      return token ? redirectTo(req, "/modules") : response;
    }

    const protectedPaths = ["/modules"];
    const isProtected = protectedPaths.some((p) => path.startsWith(p));

    if (isProtected && !token) {
      return redirectTo(req, "/login");
    }

    return response;
  } catch (e) {
    console.error("Error verificando token en middleware:", e);

    return redirectTo(req, "/login");
  }
};
