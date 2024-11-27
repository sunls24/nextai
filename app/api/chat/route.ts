import { getOpenAI } from "@/app/api/openai";
import { streamText } from "ai";
import { getLocaleTime } from "@/lib/utils";
import { tools } from "@/app/api/chat/tools";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, config } = await req.json();

  try {
    const result = await streamText({
      topP: 1,
      temperature: config.temperature,
      model: getOpenAI(config.apiKey).chat(config.model),
      system: config.systemPrompt ? systemPrompt() : undefined,
      messages: messages,
      maxSteps: 6,
      tools: Object.fromEntries(
        Object.entries(tools).filter(([key]) => config.plugins[key] === true),
      ),
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err: any) => err.message ?? err.toString(),
    });
  } catch (err: any) {
    return new NextResponse(err.message ?? err.toString(), { status: 500 });
  }
}

function systemPrompt(): string {
  return `You are an AI assistant, your duty is to provide accurate and rigorous answers. When encountering questions that cannot be handled, you need to clearly inform and guide the user to propose new questions. Please reply in Chinese.
Current time: ${getLocaleTime()}`;
}
