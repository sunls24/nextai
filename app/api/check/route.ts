import { NextResponse } from "next/server";
import { SEPARATOR } from "@/lib/pool";
import { getOpenAI, isInsufficientQuota } from "@/app/api/openai";
import { getEdgeKeys, patchKeys } from "@/app/api/vercel";

export const runtime = "edge";

export async function GET() {
  try {
    const keyList = await getEdgeKeys();
    const promises = keyList.map(async (key) => {
      try {
        await (
          await getOpenAI(key)
        ).chat.completions.create({
          messages: [{ role: "user", content: "hello" }],
          model: "gpt-3.5-turbo",
          max_tokens: 1,
        });
        return key;
      } catch (err: any) {
        if (!isInsufficientQuota(err)) {
          throw err;
        }
      }
    });

    const newList = (await Promise.all(promises)).filter(Boolean);
    if (newList.length != keyList.length) {
      await patchKeys(newList.join(SEPARATOR));
    }
    return new NextResponse(`total: ${keyList.length}, now: ${newList.length}`);
  } catch (err: any) {
    return new NextResponse(err.cause ?? err);
  }
}
