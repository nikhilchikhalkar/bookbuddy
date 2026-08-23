import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "admin_session_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isProtectedAdminPage =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && !isLoginPage);
  const isProtectedAdminApi =
    pathname.startsWith("/api/admin/") &&
    !pathname.startsWith("/api/admin/auth/login");

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const secret =
        process.env.AUTH_SECRET ||
        "default_development_secret_min_32_characters_12345";
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretKey);
      if (payload && payload.adminId) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If user is trying to visit /admin/login while already logged in
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // If unauthenticated trying to access protected admin page
  if (isProtectedAdminPage && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If unauthenticated trying to access protected admin API
  if (isProtectedAdminApi && !isAuthenticated) {
    return NextResponse.json(
      { success: false, message: "Unauthorized admin access." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
