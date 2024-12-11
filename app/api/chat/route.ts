import { getOpenAI } from "@/app/api/openai";
import { streamText } from "ai";
import { getLocaleTime } from "@/lib/utils";
import { tools } from "@/app/api/chat/tools";
import { NextResponse } from "next/server";
import { ERROR_PREFIX, MODE_TRANSLATE } from "@/lib/constants";

export async function POST(req: Request) {
  const { messages, config } = await req.json();

  try {
    const { fullStream } = streamText({
      temperature: config.temperature,
      model: getOpenAI(config.apiKey).chat(config.model),
      system: getSystem(config.systemPrompt),
      messages: messages,
      maxRetries: 0,
      maxSteps: 6,
      tools: Object.fromEntries(
        Object.entries(tools).filter(([key]) => config.plugins[key] === true),
      ),
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of fullStream) {
          switch (part.type) {
            case "text-delta": {
              controller.enqueue(part.textDelta);
              break;
            }
            case "error": {
              const err = part.error as any;
              controller.enqueue(
                ERROR_PREFIX + (err.message ?? err.toString()),
              );
              break;
            }
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
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
