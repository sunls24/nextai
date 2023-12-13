import { SelectInfo } from "@/components/select-warp";

export const StoreVersion = 2.1;
export const VERSION = "2.1.4";

export const OPENAI_API_KEY = "OPENAI_API_KEY";
export const REVERSE_URL = process.env.REVERSE_URL;

export enum Store {
  Chat = "chat-next-store",
  Config = "chat-next-config",
  ConfigImage = "chat-next-image",
}

export const models = ["gpt-3.5-turbo", "gpt-3.5-turbo-1106"];

export const ImageSelect = {
  size: ["1024x1024", "1792x1024", "1024x1792"],
  model: [{ value: "dall-e-3", show: "DALL·E 3" }],
  style: [
    { value: "vivid", show: "生动" },
    { value: "natural", show: "自然 / 真实" },
  ],
  quality: [
    { value: "standard", show: "标准" },
    { value: "hd", show: "高清" },
  ],
};

export const TOPIC_MAX_LENGTH = 12;
export const AUTO_TOPIC_LENGTH = 4;
export const DEFAULT_TOPIC = "新的聊天";
export const PROMPT_TOPIC =
  "总结本次聊天内容的主题，限制10个字以内，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”";
