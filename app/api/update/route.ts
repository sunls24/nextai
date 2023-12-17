import { NextResponse } from "next/server";
import { updateOpenAI } from "@/app/api/openai";

export const runtime = "edge";

export async function GET() {
  await updateOpenAI();
  return new NextResponse("done.");
}
