import { CoreTool, tool } from "ai";
import { z } from "zod";

export const tools: Record<string, CoreTool> = {
  googleSearch: tool({
    description: "using Google to search the internet",
    parameters: z.object({
      keyword: z.string().describe("search keyword"),
    }),
    execute: async ({ keyword }) => {
      console.log(`googleSearch: ${keyword}`);

      const apiKey = process.env.GOOGLE_API_KEY;
      const engineId = process.env.GOOGLE_ENGINE_ID;
      if (!apiKey || !engineId) {
        return "apiKey or engineId is empty";
      }
      try {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?&fields=items(title,link,snippet,pagemap/metatags(og:description))&key=${apiKey}&cx=${engineId}&q=${keyword}`,
        );
        return (await res.json()).items;
      } catch (err: any) {
        return (err.cause ?? err).toString();
      }
    },
  }),
};
