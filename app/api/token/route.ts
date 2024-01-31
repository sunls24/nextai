import { NextResponse } from "next/server";
import { SEPARATOR } from "@/lib/pool";
import { accessTokenInfo } from "@/app/api/openai";
import { fetchForm } from "@/lib/utils";
import { REVERSE_URL } from "@/lib/constants";
import { getOpenAIKeys, updateOpenAIKeys } from "@/lib/alist";

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
    const errorList: string[] = [];
    const keyList = (await getOpenAIKeys()).split(SEPARATOR);
    const promises = keyList.map(async (key, index) => {
      if (key.startsWith("sk-")) {
        return key;
      }
      const [email, exp] = accessTokenInfo(key);
      if (exp - new Date().getTime() / 1000 > 604800) {
        return key;
      }
      const res = await fetchForm(`${REVERSE_URL}/auth/token`, {
        username: email,
        password,
      });
      const result = await res.json();
      if (result.msg) {
        errorList.push(`${index}: ${result.msg}`);
        return key;
      }
      return result["accessToken"] ?? key;
    });

    await updateOpenAIKeys((await Promise.all(promises)).join(SEPARATOR));
    return errorList.length
      ? new NextResponse(errorList.join("\n"))
      : new NextResponse("done.");
  } catch (err: any) {
    return new NextResponse(err.cause ?? err);
  }
}
