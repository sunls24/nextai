import { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { onFunctionCall, tools } from "@/app/api/chat/tools";
import { getOpenAI } from "@/app/api/openai";
import { CreateMessage, OpenAIStream, StreamingTextResponse } from "ai";
import { getLocaleTime } from "@/lib/utils";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, config, contextIndex } = await req.json();
  if (contextIndex) {
    messages.splice(0, contextIndex);
  }

  messages.unshift(systemPrompt());
  const body: ChatCompletionCreateParams.ChatCompletionCreateParamsStreaming = {
    stream: true,
    model: config.model,
    temperature: config.temperature,
    tools: tools.filter((v) => config.plugins[v.function.name]?.enabled),
    messages,
  };
  body.tools!.length || delete body.tools;

  try {
    const response = await getOpenAI(config.apiKey).chat.completions.create(
      body,
    );
    const stream = OpenAIStream(response, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        args.config = config.plugins[name];
        const result = await onFunctionCall(name, args);
        const newMessages = createFunctionCallMessages(result);
        return getOpenAI(config.apiKey).chat.completions.create({
          ...body,
          messages: [...messages, ...newMessages],
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (err: any) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status });
    }

    return new NextResponse(err.message ?? err.toString(), { status: 500 });
  }
}

function systemPrompt(): CreateMessage {
  return {
    role: "system",
    content: `You are an AI assistant, your duty is to provide accurate and rigorous answers. When encountering questions that cannot be handled, you need to clearly inform and guide the user to propose new questions. Please reply in Chinese.
Current time: ${getLocaleTime()}`,
  };
}
