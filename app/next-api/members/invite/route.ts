import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth-cookie";

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? "http://127.0.0.1:8000";
}

export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromCookie();
    if (!token) return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });

    const body = await request.json();
    const upstream = await fetch(`${backendBaseUrl()}/api/members/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const contentType = upstream.headers.get("content-type") ?? "";
    const responseBody = contentType.includes("application/json")
      ? await upstream.json()
      : { message: await upstream.text() };
    return NextResponse.json(responseBody, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "Unable to reach backend members invitation service." }, { status: 502 });
  }
}
