import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirection logic disabled to allow free navigation by URL.
  return NextResponse.next();
}
