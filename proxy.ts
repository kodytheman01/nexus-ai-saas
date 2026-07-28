import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "apex_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const password = process.env.OPS_DASHBOARD_PASSWORD;

  // If no password is configured, fail closed rather than leaving the panel open.
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const authorized = Boolean(password) && session === password;

  if (authorized) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
