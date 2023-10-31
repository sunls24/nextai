import OpenAI from "openai";
import { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { CreateMessage, OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { ApiConfig, Plugins } from "@/lib/store/config";
import { functions, onFunctionCall } from "@/app/api/chat/functions";
import { getLocaleTime } from "@/lib/utils";
import { apiKeyPool } from "@/lib/pool";

export const runtime = "edge";

apiKeyPool.update(process.env.OPENAI_API_KEY ?? "");
const openai = new OpenAI({ apiKey: "" });

export async function POST(req: Request) {
  const { messages, config, contextIndex } = await req.json();
  if (contextIndex) {
    messages.splice(0, contextIndex);
  }
  messages.unshift(systemPrompt());
  const apiConfig = config as ApiConfig;
  const plugins = apiConfig.plugins as Plugins;

  const body: ChatCompletionCreateParams.ChatCompletionCreateParamsStreaming = {
    model: apiConfig.model,
    temperature: apiConfig.temperature,
    stream: true,
    functions: functions.filter((v) => plugins[v.name].enabled),
    messages,
  };
  body.functions!.length || delete body.functions;
  openai.apiKey = await apiKeyPool.getNextEdge(apiConfig.apiKey);
  try {
    const response = await openai.chat.completions.create(body);
    const stream = OpenAIStream(response, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        args.config = plugins[name];
        const result = await onFunctionCall(name, args);
        const newMessages = createFunctionCallMessages(result);
        openai.apiKey = await apiKeyPool.getNextEdge(apiConfig.apiKey);
        return openai.chat.completions.create({
          ...body,
          messages: [...messages, ...newMessages],
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status });
    } else {
      return new NextResponse(String(err), { status: 500 });
    }
  }
}

function systemPrompt(): CreateMessage {
  return {
    role: "system",
    content: `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2021-09
Current time: ${getLocaleTime()}`,
  };
}
