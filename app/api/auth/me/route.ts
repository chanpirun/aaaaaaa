import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, AUTH_USER_COOKIE } from "@/lib/auth-cookie";
import { cookies } from "next/headers";

/**
 * GET /api/auth/me
 * Returns the stored user info from the non-HttpOnly cookie.
 * The user cookie contains no secrets — just id, name, email, role.
 */
export async function GET(request: NextRequest) {
  const token = await getTokenFromCookie();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  // Read user info from the user cookie (not secret, readable by JS)
  const cookieStore = await cookies();
  const userRaw = cookieStore.get(AUTH_USER_COOKIE)?.value;

  if (!userRaw) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const user = JSON.parse(userRaw);
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }
}
