import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const setCorsHeaders = (response: NextResponse) => {
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN!,
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, next-action, next-router-state-tree",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
};

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next();

  setCorsHeaders(response);

  if (req.method === "OPTIONS") {
    return response;
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get("msp");
  const token = cookie?.value;
  // console.log(`token middleware 🔐: ${token}`, req.nextUrl.pathname)

  try {
    if (req.nextUrl.pathname == "/") {
      if (token) {
        const url = req.nextUrl.clone();

        url.pathname = "/apphub";

        return NextResponse.redirect(url);
      } else {
        const url = req.nextUrl.clone();

        url.pathname = "/login";

        return NextResponse.redirect(url);
      }
    }
    if (req.nextUrl.pathname == "/login") {
      if (token) {
        const url = req.nextUrl.clone();

        url.pathname = "/apphub";

        return NextResponse.redirect(url);
      } else {
        return response;
      }
    }

    if (req.nextUrl.pathname.startsWith("/apphub")) {
      if (token) {
        return response;
      } else {
        const url = req.nextUrl.clone();

        url.pathname = "/login";

        return NextResponse.redirect(url);
      }
    }
  } catch (e) {
    console.log("Error verificando token en middleware");
    const url = req.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }
};
