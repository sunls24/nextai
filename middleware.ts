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
  const to = `${REVERSE_HOST}${request.nextUrl.pathname.substring(12)}`;
  console.log("rewrite", request.nextUrl.pathname, "->", to);
  return NextResponse.rewrite(to);
}
