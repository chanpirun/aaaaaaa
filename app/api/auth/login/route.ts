import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendBaseUrl =
      process.env.BACKEND_API_BASE_URL ?? "http://127.0.0.1:8000";

    const upstream = await fetch(`${backendBaseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const responseBody = isJson
      ? await upstream.json()
      : { message: "Invalid response from backend auth service." };

    return NextResponse.json(responseBody, { status: upstream.status });
  } catch {
    return NextResponse.json(
      {
        message:
          "Unable to reach backend authentication service. Please ensure backend is running.",
      },
      { status: 502 },
    );
  }
}
