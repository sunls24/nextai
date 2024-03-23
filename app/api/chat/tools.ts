import { ChatCompletionTool } from "openai/resources/chat/completions";

interface ToolCall {
  tool: ChatCompletionTool;
  call: (name: string, args: Record<string, unknown>) => Promise<any>;
}

const toolMap: Record<string, ToolCall> = {
  googleSearch: {
    tool: {
      type: "function",
      function: {
        name: "googleSearch",
        description: "Search the web for information using Google",
        parameters: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "Keywords for searching",
            },
          },
          required: ["keyword"],
        },
      },
    },
    call: async (name, args) => {
      const nothing = "nothing";
      const cfg = args.config as any;
      const apiKey = cfg.apiKey || process.env.GOOGLE_API_KEY;
      const engineId = cfg.engineId || process.env.GOOGLE_ENGINE_ID;
      if (!apiKey || !engineId) {
        console.log(`- ${name} apiKey or engineId is empty`);
        return nothing;
      }
      try {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?&fields=items(title,link,snippet,pagemap/metatags(og:description))&key=${apiKey}&cx=${engineId}&q=${args.keyword}`,
        );
        const result = await res.json();
        return result.items ?? nothing;
      } catch (err: any) {
        console.log(`- ${name} ${err.cause ?? err}`);
        return nothing;
      }
    },
  },
};

export const tools: ChatCompletionTool[] = Object.values(toolMap).map(
  (value) => value.tool,
);

export async function onToolCall(
  name: string,
  args: Record<string, unknown>,
): Promise<any> {
  console.log("- onToolCall", name, args);
  if (!toolMap.hasOwnProperty(name)) {
    return `${name} tool not found`;
  }
  return toolMap[name].call(name, args);
}
