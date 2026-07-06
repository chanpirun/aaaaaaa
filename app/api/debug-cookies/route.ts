import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-cookie";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  return NextResponse.json({
    message: "Debug cookies",
    tokenPresent: Boolean(token),
    tokenLength: token ? token.length : 0,
    allCookies: allCookies.map(c => ({ 
      name: c.name, 
      value: c.name === AUTH_TOKEN_COOKIE ? "[REDACTED]" : c.value 
    })),
    requestUrl: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });
}
