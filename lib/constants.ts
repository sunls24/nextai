import { SelectInfo } from "@/lib/types";

export const StoreVersion = 2.3;
export const VERSION = "2.3.3";

export enum Store {
  Chat = "nextai-chat",
  ConfigChat = "nextai-config-chat",
}

export const models: SelectInfo[] = [
  { name: "OpenAI", list: ["gpt-3.5-turbo", "gpt-4"] },
];

export const MODE_TRANSLATE = "translate";

export const GITHUB_URL = "https://github.com/sunls24/nextai";

export const TOPIC_MAX_LENGTH = 12;
export const AUTO_TOPIC_LENGTH = 4;
export const DEFAULT_TOPIC = "新的聊天";
export const PROMPT_TOPIC =
  "总结本次聊天内容的主题，限制10个字以内，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”";

export const DOT_FLAG = "[](dot)";
