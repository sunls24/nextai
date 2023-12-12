import { NextRequest, NextResponse } from "next/server";
import { REVERSE_URL } from "@/lib/constants";

export const config = {
  matcher: "/api/reverse/(.+)",
};

export function middleware(request: NextRequest) {
  if (!REVERSE_URL) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(
    `${REVERSE_URL}${request.nextUrl.pathname.substring(12)}`,
  );
}
