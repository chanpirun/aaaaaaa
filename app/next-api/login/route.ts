import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookie";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Use internal URL for server-to-server calls to avoid Cloudflare/Nginx SSL loop
    const backendBaseUrl =
      process.env.INTERNAL_BACKEND_URL ??
      process.env.BACKEND_API_BASE_URL ??
      "http://127.0.0.1:8000";

    const upstream = await fetch(`${backendBaseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      return NextResponse.json(
        { message: "Invalid response from backend auth service." },
        { status: 502 }
      );
    }

    const data = await upstream.json();

    // On failed login, just forward the error — no cookie set
    if (!upstream.ok) {
      return NextResponse.json(
        { message: data.message ?? "Invalid credentials" },
        { status: upstream.status }
      );
    }

    const { token, user } = data;

    if (!token || !user) {
      return NextResponse.json(
        { message: "Unexpected response from auth service." },
        { status: 502 }
      );
    }

    // ── SECURITY ────────────────────────────────────────────────────────────
    // Store the token in an HttpOnly cookie — JavaScript can NEVER read it.
    // Only the user object (safe, no secret) is sent back to the client.
    // ────────────────────────────────────────────────────────────────────────
    const response = NextResponse.json(
      { user },  // token is intentionally NOT in the response body
      { status: 200 }
    );

    setAuthCookies(response, token, user);

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to reach backend authentication service." },
      { status: 502 }
    );
  }
}
