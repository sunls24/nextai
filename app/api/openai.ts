import OpenAI from "openai";
import { ApiKeyPool } from "@/lib/pool";

const apiKeyPool = new ApiKeyPool();

export function init(keys: string) {
  apiKeyPool.update(keys);
}

export async function getOpenAI(key?: string): Promise<OpenAI> {
  return new OpenAI({ apiKey: await apiKeyPool.getNextEdge(key) });
}

export function isInsufficientQuota(err: Error) {
  return err instanceof OpenAI.APIError && err.code === "insufficient_quota";
}

export function accessTokenInfo(token: string) {
  const info = JSON.parse(atob(token.split(".")[1]));
  return [info["https://api.openai.com/profile"].email, info.exp];
}
