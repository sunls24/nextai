import { OPENAI_API_KEY } from "@/lib/constants";
import { get } from "@vercel/edge-config";
import { SEPARATOR } from "@/lib/pool";

const configId = process.env.EDGE_CONFIG?.match(/com\/([^?]+)/)![1];
const apiToken = process.env.API_TOKEN;

export async function patchKeys(keys: string): Promise<any> {
  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${configId}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            operation: "update",
            key: OPENAI_API_KEY,
            value: keys,
          },
        ],
      }),
    },
  );
  const err = (await res.json()).error?.message;
  if (err) {
    throw new Error(err);
  }
}

export async function getEdgeKeys() {
  if (!process.env.EDGE_CONFIG || !process.env.API_TOKEN) {
    throw new Error("not found EDGE_CONFIG or API_TOKEN");
  }
  const keys = await get(OPENAI_API_KEY);
  if (!keys) {
    throw new Error("not found api key or token");
  }
  return (keys as string).split(SEPARATOR);
}
