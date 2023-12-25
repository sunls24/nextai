import { providerHandler } from "@/app/api/chat/provider";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, config, contextIndex, provider } = await req.json();
  if (contextIndex) {
    messages.splice(0, contextIndex);
  }

  return providerHandler(messages, config, provider);
}
