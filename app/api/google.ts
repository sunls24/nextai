import { ApiKeyPool } from "@/lib/pool";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeyPool = new ApiKeyPool().update(process.env.GOOGLE_API_KEY ?? "");
const clientPool: Map<string, GoogleGenerativeAI> = new Map();

export function getGoogleAI(key?: string): GoogleGenerativeAI {
  const apiKey = key || apiKeyPool.getNext();
  if (!clientPool.has(apiKey)) {
    clientPool.set(apiKey, new GoogleGenerativeAI(apiKey));
  }
  return clientPool.get(apiKey)!;
}

export function getNextGoogle() {
  return apiKeyPool.getNext();
}
