import OpenAI from "openai";
import { ApiKeyPool } from "@/lib/pool";
import { execOnce } from "next/dist/shared/lib/utils";
import { getOpenAIKeys } from "@/lib/alist";

const apiKeyPool = new ApiKeyPool().update(process.env.OPENAI_API_KEY ?? "");
const clientPool: Map<string, OpenAI> = new Map();

const initOpenAI = execOnce(updateOpenAI);

export async function getOpenAI(key?: string): Promise<OpenAI> {
  await initOpenAI();
  const apiKey = key || apiKeyPool.getNext();
  if (!clientPool.has(apiKey)) {
    clientPool.set(apiKey, new OpenAI({ apiKey: apiKey }));
  }
  return clientPool.get(apiKey)!;
}

export async function updateOpenAI() {
  try {
    apiKeyPool.update(await getOpenAIKeys());
  } catch (err: any) {
    console.log("updateOpenAI:", err.toString());
  }
}

export async function getNextKey() {
  await initOpenAI();
  return apiKeyPool.getNext();
}

export function isUnavailable(err: Error) {
  return (
    err instanceof OpenAI.APIError &&
    (err.code === "insufficient_quota" || err.code === "account_deactivated")
  );
}

export function accessTokenInfo(token: string) {
  const info = JSON.parse(atob(token.split(".")[1]));
  return [info["https://api.openai.com/profile"].email, info.exp];
}
