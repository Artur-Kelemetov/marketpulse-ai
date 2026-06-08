import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  hasAdminAuthConfig,
  isValidAdminSession,
} from "@/lib/auth/admin-auth-config";

export function proxy(request: NextRequest) {
  if (!hasAdminAuthConfig()) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (isValidAdminSession(session)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/assets/:path*",
    "/ideas/:path*",
    "/drafts/:path*",
    "/calendar/:path*",
    "/publications/:path*",
    "/settings/:path*",
  ],
};