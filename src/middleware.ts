import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("auth_role")?.value?.toLowerCase();

  const blockedFromAqad = role === "student" || role === "applicant";
  if (pathname.startsWith("/aqad") && blockedFromAqad) {
    return NextResponse.redirect(new URL(role === "applicant" ? "/admission/status" : "/student", request.url));
  }

  return NextResponse.next();
}
