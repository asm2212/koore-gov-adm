import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/super-admin": ["SUPER_ADMIN"],
  "/admin": ["ADMIN", "SUPER_ADMIN"],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("portal_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let role: string | null = null;
  try {
    const decoded: any = jwtDecode(token);
    role = decoded.role;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const path = req.nextUrl.pathname;
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (path.startsWith(route) && !roles.includes(role ?? '')) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*"],
};
