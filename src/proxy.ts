import { NextResponse, NextRequest } from "next/server";

const redirectTo = (req: NextRequest, pathname: string) => {
  const url = req.nextUrl.clone();

  url.pathname = pathname;

  return NextResponse.redirect(url);
};

export const proxy = async (req: NextRequest) => {
  const response = NextResponse.next();

  if (req.method === "OPTIONS") {
    return response;
  }

  const sid = req.cookies.get("sid")?.value;
  const path = req.nextUrl.pathname;

  try {
    if (path === "/") {
      return sid
        ? redirectTo(req, "/apphub")
        : redirectTo(req, "/api/auth/login");
    }

    const isProtected = path === "/apphub" || path.startsWith("/apphub/");

    if (isProtected && !sid) {
      const login = req.nextUrl.clone();
      login.pathname = "/api/auth/login";
      login.search = "";
      login.searchParams.set(
        "returnPath",
        req.nextUrl.pathname + req.nextUrl.search,
      );
      return NextResponse.redirect(login);
    }

    return response;
  } catch {
    return redirectTo(req, "/auth/error");
  }
};

export const config = {
  matcher: ["/((?!api/auth/|auth/error|_next/|favicon.ico|.*\\..*).*)"],
};
