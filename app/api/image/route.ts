import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAI } from "../openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { config, apiKey, prompt } = await req.json();
  console.log(config, prompt, apiKey);
  try {
    const response = await (
      await getOpenAI(apiKey)
    ).images.generate({
      ...config,
      prompt: prompt,
      // response_format: "b64_json",
      n: 1,
    });
    return new NextResponse(response.data[0].url);
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status });
    }
    return new NextResponse(String(err), { status: 500 });
  }
}
