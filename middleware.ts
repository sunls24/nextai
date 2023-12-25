import { NextRequest, NextResponse } from "next/server";
import { REVERSE_URL } from "@/lib/constants";
import { getNextOpenAI } from "@/app/api/openai";
import { getNextGoogle } from "@/app/api/google";

export const config = {
  matcher: ["/api/reverse/(.+)", "/api/x/(.+)", "/api/g/(.+)"],
};

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "86400",
};

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: corsHeaders });
  }
  try {
    if (req.nextUrl.pathname.startsWith("/api/x/")) {
      return await x(req);
    }
    if (req.nextUrl.pathname.startsWith("/api/g/")) {
      return await g(req);
    }
    if (req.nextUrl.pathname.startsWith("/api/reverse/")) {
      return reverse(req);
    }
  } catch (err: any) {
    return new NextResponse(err.cause ?? err, { status: 500 });
  }
}

const X_API_KEY = process.env.X_API_KEY ?? "";

const xAuth = authHeader(X_API_KEY);

function authHeader(key: string) {
  return `Bearer ${key}`;
}

async function x(req: NextRequest) {
  const auth = req.headers.get("Authorization") ?? authHeader("");
  return await fetch(
    `https://api.openai.com${req.nextUrl.pathname.substring(6)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          auth === xAuth ? authHeader(await getNextOpenAI()) : auth,
      },
      method: req.method,
      body: req.body,
      redirect: "manual",
      cache: "no-cache",
    },
  );
}

async function g(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key === X_API_KEY) {
    req.nextUrl.searchParams.set("key", getNextGoogle());
  }
  const pathname = req.nextUrl.pathname.substring(6);
  return await fetch(
    `https://generativelanguage.googleapis.com${pathname}?${req.nextUrl.searchParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: req.method,
      body: req.body,
      redirect: "manual",
      cache: "no-cache",
    },
  );
}

function reverse(req: NextRequest) {
  if (!REVERSE_URL) {
    return NextResponse.next();
  }
  return NextResponse.rewrite(
    `${REVERSE_URL}${req.nextUrl.pathname.substring(12)}`,
  );
}
