import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAI } from "../openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      await (await getOpenAI()).chat.completions.create(await req.json()),
    );
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status });
    }
    return new NextResponse(String(err), { status: 500 });
  }
}
