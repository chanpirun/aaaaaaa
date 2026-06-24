import { NextRequest, NextResponse } from "next/server";

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? "http://127.0.0.1:8000";
}

export async function POST(request: NextRequest, { params }: any) {
  try {
    // Await params if it's a promise (Next 15), otherwise just access it (Next 14)
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const authorization = request.headers.get("authorization") ?? "";
    const upstream = await fetch(`${backendBaseUrl()}/api/notifications/${id}/read`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: authorization,
      },
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await upstream.json()
      : { message: await upstream.text() };
    return NextResponse.json(body, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach backend service." },
      { status: 502 },
    );
  }
}
