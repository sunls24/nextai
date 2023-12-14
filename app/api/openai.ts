import OpenAI from "openai";
import { ApiKeyPool } from "@/lib/pool";

const apiKeyPool = new ApiKeyPool().update(process.env.OPENAI_API_KEY ?? "");
const clientPool: Map<string, OpenAI> = new Map();

export async function getOpenAI(key?: string): Promise<OpenAI> {
  const apiKey =
    key || (await apiKeyPool.getNextEdge(() => clientPool.clear()));
  if (!clientPool.has(apiKey)) {
    clientPool.set(apiKey, new OpenAI({ apiKey: apiKey }));
  }
  return clientPool.get(apiKey)!;
}

export function isInsufficientQuota(err: Error) {
  return err instanceof OpenAI.APIError && err.code === "insufficient_quota";
}

export function accessTokenInfo(token: string) {
  const info = JSON.parse(atob(token.split(".")[1]));
  return [info["https://api.openai.com/profile"].email, info.exp];
}
