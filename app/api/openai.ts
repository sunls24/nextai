import OpenAI from "openai";
import { ApiKeyPool } from "@/lib/pool";

const apiKeyPool = new ApiKeyPool();
const openai = new OpenAI({ apiKey: "" });
const baseURL = openai.baseURL;
const reverseURL = process.env.REVERSE_URL ?? baseURL;

export function init(keys: string) {
  apiKeyPool.update(keys);
}

export async function getOpenAI(key?: string): Promise<OpenAI> {
  openai.apiKey = await apiKeyPool.getNextEdge(key);
  openai.baseURL = isApiKey(openai.apiKey) ? baseURL : reverseURL;
  return openai;
}

function isApiKey(key: string) {
  return key.length === 0 || key.startsWith("sk-");
}
