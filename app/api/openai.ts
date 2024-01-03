import OpenAI from "openai";
import { ApiKeyPool } from "@/lib/pool";
import { execOnce } from "next/dist/shared/lib/utils";
import { getOpenAIKeys } from "@/lib/alist";
import { X_API_KEY } from "@/middleware";

export const sd2dall = new OpenAI({ apiKey: "", baseURL: process.env.SD2DALL });

const apiKeyPool = new ApiKeyPool().update(process.env.OPENAI_API_KEY ?? "");
const clientPool: Map<string, OpenAI> = new Map();

const initOpenAI = execOnce(updateOpenAI);

export async function getOpenAI(key?: string, model?: string): Promise<OpenAI> {
  await initOpenAI();
  let baseURL = undefined;
  if (key === X_API_KEY) {
    key = model?.startsWith("gpt-4") ? process.env.GITHUB_TOKEN : undefined;
    baseURL = key && process.env.COPILOT_PROXY;
  }
  const apiKey = key || apiKeyPool.getNext();
  if (!clientPool.has(apiKey)) {
    clientPool.set(apiKey, new OpenAI({ apiKey, baseURL }));
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

export async function getNextOpenAI() {
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
