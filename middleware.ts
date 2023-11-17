import { NextRequest, NextResponse } from "next/server";

const REVERSE_HOST =
  process.env.REVERSE_URL?.match(/^(https?:\/\/[^\/]+)/)?.[1];

export const config = {
  matcher: "/api/reverse/(.+)",
};

export function middleware(request: NextRequest) {
  if (!REVERSE_HOST) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(
    `${REVERSE_HOST}${request.nextUrl.pathname.substring(12)}`,
  );
}
