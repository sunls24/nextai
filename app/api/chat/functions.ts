import { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { SEPARATOR } from "@/lib/pool";
import { sd2dall } from "@/app/api/openai";

interface FunctionCall {
  function: ChatCompletionCreateParams.Function;
  call: (name: string, args: Record<string, unknown>) => Promise<any>;
}

const searchApiKey = process.env.GOOGLE_API_KEY?.split(SEPARATOR)[0];
const functionMap: Record<string, FunctionCall> = {
  googleSearch: {
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
    call: async (name, args) => {
      const nothing = "nothing";
      const cfg = args.config as any;
      const apiKey = cfg.apiKey || searchApiKey;
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
  browseWebsite: {
    function: {
      name: "browseWebsite",
      description: "Get website content through via given url",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "Website address",
          },
        },
        required: ["url"],
      },
    },
    call: async (name, args) => {
      const cfg = args.config as any;
      const url = args.url as string;
      try {
        const res = await fetch(url);
        let result = await res.text();
        result = NodeHtmlMarkdown.translate(result);
        result = result.replace(/^\s+|\s+$/gm, "\n").replace(/(\n{2,})/g, "\n");
        if (result.length > cfg.maxLength) {
          console.log(`- ${name} ${url} Cut off!!!`);
          result = result.substring(0, cfg.maxLength);
        }
        return result;
      } catch (err: any) {
        console.log(`- ${name} ${err.cause ?? err}`);
        return "Unable to access this website";
      }
    },
  },
  weatherInfo: {
    function: {
      name: "weatherInfo",
      description: "Get online weather information",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Query location",
          },
          type: {
            type: "string",
            description:
              "base: return live weather, all: return forecast weather",
          },
        },
        required: ["location", "type"],
      },
    },
    call: async (name, args) => {
      const nothing = "Unable to get weather information";
      const cfg = args.config as any;
      const key = cfg.amapKey || process.env.AMAP_KEY;
      if (!key) {
        console.log(`- ${name} amapKey is empty`);
        return nothing;
      }
      try {
        let res = await fetch(
          `https://restapi.amap.com/v3/geocode/geo?address=${args.location}&key=${key}`,
        );
        let result = await res.json();
        if (result.status != 1 || result.count < 1) {
          console.log(`- ${name} ${args.location} ${result.info}`);
          return nothing;
        }
        res = await fetch(
          `https://restapi.amap.com/v3/weather/weatherInfo?city=${result.geocodes[0].adcode}&key=${key}&extensions=${args.type}`,
        );
        result = await res.json();
        if (result.status != 1 || result.count < 1) {
          console.log(`- ${name} ${args.location} ${result.info}`);
          return nothing;
        }
        return result;
      } catch (err: any) {
        console.log(`- ${name} ${err.cause ?? err}`);
        return nothing;
      }
    },
  },
  imageGeneration: {
    function: {
      name: "imageGeneration",
      description: "Generate image by detailed English prompt",
      parameters: {
        type: "object",
        properties: {
          enPromptDetail: {
            type: "string",
            description:
              "For a better image, provide more details and consider composition elements such as theme, background, color scheme, lighting, and positioning.",
          },
        },
        required: ["enPromptDetail"],
      },
    },
    call: async (name, args) => {
      const prompt = args.enPromptDetail as string;
      try {
        const response = await sd2dall.images.generate({
          prompt: prompt,
          // response_format: "b64_json",
          model: "dall-e-3",
          size: "1024x1024",
          n: 1,
        });
        return {
          result: { url: response.data[0].url },
          system: "Display this image using full url and md format",
        };
      } catch (err: any) {
        console.log(`- ${name} ${err.cause ?? err}`);
        return "Generate failure";
      }
    },
  },
};

export const functions: ChatCompletionCreateParams.Function[] = Object.values(
  functionMap,
).map((value) => value.function);

export async function onFunctionCall(
  name: string,
  args: Record<string, unknown>,
): Promise<any> {
  console.log("- onFunctionCall", name, args);
  if (!functionMap.hasOwnProperty(name)) {
    return `${name} function not found`;
  }
  return functionMap[name].call(name, args);
}
