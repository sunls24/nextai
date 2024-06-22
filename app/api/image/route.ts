import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOpenAI } from "../openai";

export const runtime = "edge";

export async function POST(req: Request) {
  let { config, apiKey, prompt, model } = await req.json();

  try {
    if (config.model === "stable-diffusion" && config.autoPrompt) {
      const res = await getOpenAI(apiKey).chat.completions.create({
        model,
        temperature: 0.6,
        messages: [
          { role: "system", content: optimizePrompt },
          { role: "user", content: prompt },
        ],
      });
      prompt = res.choices[0].message.content;
    }
    delete config.autoPrompt;
    const response = await getOpenAI(apiKey).images.generate({
      ...config,
      prompt: prompt,
      size: "1024x1024",
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

const optimizePrompt = `The user will provide a description for image generation, please refine this content. Enhance details and employ precise vocabulary, considering image composition for richer, thereby aiding superior image generation.
1. Respond only in English.
2. Maintain brevity, ensuring content doesn't exceed 800 characters.`;
