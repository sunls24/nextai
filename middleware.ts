import { NextRequest, NextResponse } from "next/server";
import { REVERSE_URL } from "@/lib/constants";
import { getNextKey } from "@/app/api/openai";

export const config = {
  matcher: ["/api/reverse/(.+)", "/api/x/(.+)"],
};

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/x/")) {
    return await x(req);
  }
  if (req.nextUrl.pathname.startsWith("/api/reverse/")) {
    return reverse(req);
  }
}

const skx = `Bearer ${process.env.SKX}`;

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "86400",
};

async function x(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: corsHeaders });
  }

  try {
    const auth = req.headers.get("Authorization") ?? "";
    return await fetch(
      `https://api.openai.com${req.nextUrl.pathname.substring(6)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: auth === skx ? `Bearer ${await getNextKey()}` : auth,
        },
        method: req.method,
        body: req.body,
        redirect: "manual",
        cache: "no-cache",
      },
    );
  } catch (err: any) {
    return new NextResponse(err.cause ?? err, { status: 500 });
  }
}

function reverse(req: NextRequest) {
  if (!REVERSE_URL) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(
    `${REVERSE_URL}${req.nextUrl.pathname.substring(12)}`,
  );
}
