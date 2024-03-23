import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const clientPool: Map<string, OpenAI> = new Map();

export function getOpenAI(apiKey: string): OpenAI {
  apiKey = apiKey || OPENAI_API_KEY;
  if (!clientPool.has(apiKey)) {
    clientPool.set(apiKey, new OpenAI({ apiKey }));
  }
  return clientPool.get(apiKey)!;
}
