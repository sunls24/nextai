import { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { functions, onFunctionCall } from "@/app/api/chat/functions";
import { getOpenAI } from "@/app/api/openai";
import {
  CreateMessage,
  GoogleGenerativeAIStream,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { ApiConfig } from "@/lib/store/config-chat";
import { getGoogleAI } from "@/app/api/google";
import { getLocaleTime } from "@/lib/utils";

function systemPrompt(): CreateMessage {
  return {
    role: "system",
    content: `You are ChatGPT, a large language model trained by OpenAI.
Current time: ${getLocaleTime()}`,
  };
}

async function openaiHandler(messages: any, config: ApiConfig) {
  messages.unshift(systemPrompt());
  const body: ChatCompletionCreateParams.ChatCompletionCreateParamsStreaming = {
    model: config.model,
    temperature: config.temperature,
    stream: true,
    functions: functions.filter((v) => config.plugins![v.name]?.enabled),
    messages,
  };
  body.functions!.length || delete body.functions;
  const response = await (
    await getOpenAI(config.apiKey, config.model)
  ).chat.completions.create(body);
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      args.config = config.plugins![name];
      args.apiKey = config.apiKey;
      const result = await onFunctionCall(name, args);
      const newMessages = createFunctionCallMessages(result.result ?? result);
      if (result.system) {
        newMessages.push({ role: "system", content: result.system });
      }
      return (await getOpenAI(config.apiKey)).chat.completions.create({
        ...body,
        messages: [...messages, ...newMessages],
      });
    },
  });

  return new StreamingTextResponse(stream);
}

function buildGoogleContent(msg: CreateMessage[]) {
  return {
    contents: msg
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
  };
}

async function googleHandler(messages: CreateMessage[], config: ApiConfig) {
  const stream = await getGoogleAI(config.apiKey)
    .getGenerativeModel({
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
      },
    })
    .generateContentStream(buildGoogleContent(messages));
  return new StreamingTextResponse(GoogleGenerativeAIStream(stream));
}

const providerMap: { [key: string]: any } = {
  openai: openaiHandler,
  google: googleHandler,
};

export async function providerHandler(
  messages: any,
  config: any,
  provider: string,
) {
  try {
    return await providerMap[provider](messages, config);
  } catch (err: any) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status });
    }

    return new NextResponse(err.message ?? err.toString(), { status: 500 });
  }
}
