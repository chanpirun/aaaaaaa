import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Cookie names
// ─────────────────────────────────────────────────────────────────────────────
export const AUTH_TOKEN_COOKIE = "radice_auth_token";
export const AUTH_USER_COOKIE  = "radice_auth_user";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ─────────────────────────────────────────────────────────────────────────────
// Cookie options
// - HttpOnly: JS cannot read the token — eliminates XSS token theft
// - Secure: only sent over HTTPS in production
// - SameSite=lax: CSRF protection
// - Path=/: available site-wide
// ─────────────────────────────────────────────────────────────────────────────
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   false,
  sameSite: "lax" as const,
  path:     "/",
  maxAge:   60 * 60 * 24, // 24 hours — matches Sanctum expiration
};

export const USER_COOKIE_OPTIONS = {
  httpOnly: false, // user info is safe to read from JS (no secret)
  secure:   false,
  sameSite: "lax" as const,
  path:     "/",
  maxAge:   60 * 60 * 24,
};

// ─────────────────────────────────────────────────────────────────────────────
// Read the auth token from HttpOnly cookie (server-side only)
// ─────────────────────────────────────────────────────────────────────────────
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Set auth cookies on a NextResponse (called after login)
// ─────────────────────────────────────────────────────────────────────────────
export function setAuthCookies(
  response: NextResponse,
  token: string,
  user: { id: number; name: string; email: string; role: string }
): void {
  response.cookies.set(AUTH_TOKEN_COOKIE, token, AUTH_COOKIE_OPTIONS);
  response.cookies.set(AUTH_USER_COOKIE, JSON.stringify(user), USER_COOKIE_OPTIONS);
}

// ─────────────────────────────────────────────────────────────────────────────
// Clear auth cookies on a NextResponse (called on logout)
// ─────────────────────────────────────────────────────────────────────────────
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(AUTH_TOKEN_COOKIE, "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set(AUTH_USER_COOKIE,  "", { ...USER_COOKIE_OPTIONS, maxAge: 0 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the Authorization header for proxying to the Laravel backend
// ─────────────────────────────────────────────────────────────────────────────
export async function buildAuthHeader(): Promise<{ Authorization: string } | Record<string, never>> {
  const token = await getTokenFromCookie();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
