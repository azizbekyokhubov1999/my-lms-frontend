import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  if (!BACKEND_API_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body ?? {};

    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: "Missing required registration fields." },
        { status: 400 },
      );
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phone,
      }),
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message:
            (data as { message?: string } | null)?.message ??
            "Registration failed.",
        },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(
      {
        message:
          (data as { message?: string } | null)?.message ??
          "Registration successful.",
        user: (data as { user?: unknown } | null)?.user,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Server error occurred." },
      { status: 500 },
    );
  }
}

