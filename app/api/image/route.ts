import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAI, sd2dall } from "../openai";
import { isDall } from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: Request) {
  let { config, apiKey, prompt } = await req.json();
  console.log(config, prompt, apiKey);

  try {
    const dall = isDall(config.model);
    if (!dall && config.autoPrompt) {
      const res = await (
        await getOpenAI(apiKey, "gpt-4")
      ).chat.completions.create({
        model: "gpt-4",
        temperature: 0.6,
        messages: [
          { role: "system", content: optimizePrompt },
          { role: "user", content: prompt },
        ],
      });
      prompt = res.choices[0].message.content;
    }
    delete config.autoPrompt;
    const response = await (
      dall ? await getOpenAI(apiKey) : sd2dall
    ).images.generate({
      ...config,
      prompt: prompt,
      // response_format: "b64_json",
      n: 1,
    });
    return new NextResponse(response.data[0].url);
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status });
    }
    return new NextResponse(String(err), { status: 500 });
  }
}

function getStyle(style: string) {
  return style === "vivid"
    ? "vivid (lean towards generating hyper-real and dramatic images)"
    : "natural (produce more natural, less hyper-real looking images)";
}

const optimizePrompt = `The user will provide a description for image generation, please refine this content. Enhance details and employ precise vocabulary, considering image composition for richer, thereby aiding superior image generation.
1. Respond only in English.
2. Maintain brevity, ensuring content doesn't exceed 800 characters.`;
