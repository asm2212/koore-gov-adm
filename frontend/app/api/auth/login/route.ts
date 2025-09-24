import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!backendRes.ok) {
      const err = await backendRes.json();
      return NextResponse.json({ message: err.message || "Invalid login" }, { status: 401 });
    }

    const data = await backendRes.json();

    const response = NextResponse.json({ user: data.user });
    response.cookies.set({
      name: "portal_token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Login failed" }, { status: 500 });
  }
}
