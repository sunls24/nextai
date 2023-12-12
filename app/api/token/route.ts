import { NextResponse } from "next/server";
import { SEPARATOR } from "@/lib/pool";
import { getEdgeKeys, patchKeys } from "@/app/api/vercel";
import { accessTokenInfo } from "@/app/api/openai";
import { fetchForm } from "@/lib/utils";
import { REVERSE_URL } from "@/lib/constants";

export const runtime = "edge";

const OPENAI_PASSWORD = process.env.OPENAI_PASSWORD;

export async function GET(req: Request) {
  if (!REVERSE_URL) {
    return new NextResponse("not found REVERSE_URL");
  }
  const password =
    new URL(req.url).searchParams.get("password") ?? OPENAI_PASSWORD;
  if (!password) {
    return new NextResponse("not found OPENAI_PASSWORD");
  }
  try {
    const keyList = await getEdgeKeys();
    const promises = keyList.map(async (key, index) => {
      if (key.startsWith("sk-")) {
        return key;
      }
      const [email, exp] = accessTokenInfo(key);
      if (exp - new Date().getTime() / 1000 > 604800) {
        return key;
      }
      const res = await fetchForm(`${REVERSE_URL}/api/auth/login`, {
        username: email,
        password,
      });
      const result = await res.json();
      if (result.detail) {
        throw new Error(result.detail);
      }
      return result["access_token"] ?? key;
    });

    await patchKeys((await Promise.all(promises)).join(SEPARATOR));
    return new NextResponse("done.");
  } catch (err: any) {
    return new NextResponse(err.cause ?? err);
  }
}
