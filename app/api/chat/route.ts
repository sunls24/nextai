import { getOpenAI } from "@/app/api/openai";
import { streamText } from "ai";
import { getLocaleTime } from "@/lib/utils";
import { tools } from "@/app/api/chat/tools";
import { NextResponse } from "next/server";
import { MODE_TRANSLATE } from "@/lib/constants";

export async function POST(req: Request) {
  const { messages, config } = await req.json();

  try {
    const result = streamText({
      temperature: config.temperature,
      model: getOpenAI(config.apiKey).chat(config.model),
      system: getSystem(config.systemPrompt),
      messages: messages,
      maxSteps: 6,
      tools: Object.fromEntries(
        Object.entries(tools).filter(([key]) => config.plugins[key] === true),
      ),
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    return new NextResponse(err.message ?? err.toString(), { status: 500 });
  }
}

function getSystem(prompt: any) {
  if (prompt === true) {
    return systemPrompt();
  }
  switch (prompt) {
    case MODE_TRANSLATE:
      return translatePrompt();
  }
}

function systemPrompt(): string {
  return `You are an AI assistant, your duty is to provide accurate and rigorous answers. When encountering questions that cannot be handled, you need to clearly inform and guide the user to propose new questions. Please reply in Chinese.
Current time: ${getLocaleTime()}`;
}

function translatePrompt(): string {
  return "You are a professional, authentic translation engine. You only return the translated text, please do not explain or understand original text. (Chinese-English bidirectional translation)";
}
