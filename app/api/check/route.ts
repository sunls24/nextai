import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { OPENAI_API_KEY } from "@/lib/constants";
import OpenAI from "openai";
import { SEPARATOR } from "@/lib/pool";

export async function GET() {
  if (!process.env.EDGE_CONFIG || !process.env.API_TOKEN) {
    return new NextResponse("not found EDGE_CONFIG or API_TOKEN");
  }
  const keys = await get(OPENAI_API_KEY);
  if (!keys) {
    return new NextResponse("not found api key");
  }
  const keyList = (keys as string).split(SEPARATOR);
  const newList = [];
  const openai = new OpenAI({ apiKey: "" });
  for (const key of keyList) {
    openai.apiKey = key;
    try {
      await openai.completions.create({
        prompt: "hello",
        model: "gpt-3.5-turbo-instruct",
        max_tokens: 1,
      });
      newList.push(key);
    } catch (err: any) {
      if (err instanceof OpenAI.APIError && err.code === "insufficient_quota") {
        continue;
      }
      return new NextResponse(err);
    }
  }
  if (newList.length != keyList.length) {
    const err = await patchKeys(
      newList.join(SEPARATOR),
      process.env.EDGE_CONFIG!.match(/com\/([^?]+)/)![1],
      process.env.API_TOKEN!,
    );
    if (err) {
      return new NextResponse(err);
    }
  }

  return NextResponse.json(newList);
}

async function patchKeys(
  keys: string,
  configId: string,
  token: string,
): Promise<any> {
  try {
    const res = await fetch(
      `https://api.vercel.com/v1/edge-config/${configId}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              operation: "update",
              key: OPENAI_API_KEY,
              value: keys,
            },
          ],
        }),
      },
    );
    return (await res.json()).error?.message;
  } catch (err) {
    return err;
  }
}
