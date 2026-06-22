import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const pathname = nextUrl.pathname;

  // Define route groups
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isProtectedRoute =
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/recently-viewed") ||
    pathname.startsWith("/recommendations") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/quiz");
  const isProtectedApi =
    pathname.startsWith("/api/wishlist") ||
    pathname.startsWith("/api/recently-viewed") ||
    pathname.startsWith("/api/quiz") ||
    pathname.startsWith("/api/compare");
  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/signup") ||
    pathname.startsWith("/auth/forgot-password");

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Protect user routes
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Protect API routes
  if (isProtectedApi && !isLoggedIn) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
