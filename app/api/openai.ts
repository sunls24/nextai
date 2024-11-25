import { createOpenAI, OpenAIProvider } from "@ai-sdk/openai";

const baseURL = process.env.OPENAI_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const clientPool: Map<string, OpenAIProvider> = new Map();

export function getOpenAI(apiKey: string): OpenAIProvider {
  apiKey = apiKey || OPENAI_API_KEY;
  if (!clientPool.has(apiKey)) {
    clientPool.set(apiKey, createOpenAI({ apiKey, baseURL }));
  }
  return clientPool.get(apiKey)!;
}
