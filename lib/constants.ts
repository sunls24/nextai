export const StoreVersion = 2.2;
export const VERSION = "2.2.0";

export const REVERSE_URL = process.env.REVERSE_URL;

export enum Store {
  Chat = "nextai-chat",
  ConfigChat = "nextai-config-chat",
  ConfigImage = "nextai-config-image",
}

export const providerSelect = [
  { value: "openai", show: "OpenAI" },
  { value: "google", show: "Google" },
];

export const providerModel: { [key: string]: string[] } = {
  openai: ["gpt-3.5-turbo", "gpt-3.5-turbo-1106", "gpt-4"],
  google: ["gemini-pro"],
};

export const ImageSelect = {
  size: ["1024x1024", "1792x1024", "1024x1792"],
  model: [
    { value: "dall-e-3", show: "DALL·E 3" },
    { value: "stable-diffusion", show: "Stable Diffusion" },
  ],
  style: [
    { value: "vivid", show: "生动" },
    { value: "natural", show: "自然 / 真实" },
  ],
  quality: [
    { value: "standard", show: "标准" },
    { value: "hd", show: "高清" },
  ],
};

export const GITHUB_URL = "https://github.com/sunls24/nextai";

export const TOPIC_MAX_LENGTH = 12;
export const AUTO_TOPIC_LENGTH = 4;
export const DEFAULT_TOPIC = "新的聊天";
export const PROMPT_TOPIC =
  "总结本次聊天内容的主题，限制10个字以内，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”";

export const DOT_FLAG = "[](dot)";
