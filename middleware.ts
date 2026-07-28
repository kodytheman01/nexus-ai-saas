import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "apex_admin_session";

// NOTE: Next.js 16 renamed this convention to `proxy.ts`, but the Netlify
// Next.js adapter (@netlify/plugin-nextjs v5.15.13) does not yet bundle the
// `proxy` edge function correctly. Keeping `middleware.ts` (deprecated but
// functional) until Netlify ships support.
export function middleware(request: NextRequest) {
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
