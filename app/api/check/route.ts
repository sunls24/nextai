import { NextResponse } from "next/server";
import { getOpenAI, isUnavailable, updateOpenAI } from "@/app/api/openai";
import { getOpenAIKeys, updateOpenAIKeys } from "@/lib/alist";
import { SEPARATOR } from "@/lib/pool";

export const runtime = "edge";

export async function GET() {
  try {
    const keyList = (await getOpenAIKeys()).split(SEPARATOR);
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
        if (!isUnavailable(err)) {
          throw err;
        }
      }
    });

    const newList = (await Promise.all(promises)).filter(Boolean);
    if (newList.length != keyList.length) {
      await updateOpenAIKeys(newList.join(SEPARATOR));
    }
    await updateOpenAI();
    return new NextResponse(`total: ${keyList.length}, now: ${newList.length}`);
  } catch (err: any) {
    return new NextResponse(err.cause ?? err);
  }
}
