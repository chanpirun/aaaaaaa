import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-cookie";

// ─────────────────────────────────────────────────────────────────────────────
// Next.js Edge Middleware — runs on every request BEFORE rendering
// This is the ONLY server-side route guard.  Client-side checks in useEffect
// are UX-only; this file is the real security boundary.
// ─────────────────────────────────────────────────────────────────────────────

/** Routes that require an authenticated session */
const PROTECTED_PREFIXES = [
  "/member",
  "/director",
  "/assistant",
  "/dashboard",
];

/** Routes that authenticated users should be redirected away from */
const AUTH_ONLY_PATHS = ["/", "/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject the Bearer token header if present on api/next-api requests
  if (pathname.startsWith("/api") || pathname.startsWith("/next-api")) {
    const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    if (token && (request.method === "GET" || request.method === "DELETE")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${token}`);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    return NextResponse.next();
  }

  // Skip static assets, Next.js internals, and all other metadata
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(token);

  // Check if requesting a protected route
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // 🔒 Unauthenticated user trying to access protected route → redirect to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → skip the login page, go to dashboard
  if (AUTH_ONLY_PATHS.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
