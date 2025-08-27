// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sid = req.cookies.get("sid")?.value;
  if (!sid) {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/login";
    url.searchParams.set("returnTo", req.nextUrl.pathname || "/modules");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// solo ejecuta middleware donde conviene
export const config = {
  matcher: ["/((?!api/auth/|_next/|favicon.ico).*)"],
};
