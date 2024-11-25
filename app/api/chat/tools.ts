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
      const nothing = "nothing";
      const apiKey = process.env.GOOGLE_API_KEY;
      const engineId = process.env.GOOGLE_ENGINE_ID;
      if (!apiKey || !engineId) {
        console.log("googleSearch: apiKey or engineId is empty");
        return nothing;
      }
      try {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?&fields=items(title,link,snippet,pagemap/metatags(og:description))&key=${apiKey}&cx=${engineId}&q=${keyword}`,
        );
        const result = await res.json();
        return result.items ?? nothing;
      } catch (err: any) {
        console.log(`googleSearch: ${err.cause ?? err}`);
        return nothing;
      }
    },
  }),
};
