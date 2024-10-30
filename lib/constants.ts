import { SelectInfo, ShortcutItem } from "@/lib/types";

export const StoreVersion = 2.3;
export const VERSION = "2.3.2";

export enum Store {
  Chat = "nextai-chat",
  ConfigChat = "nextai-config-chat",
  ConfigImage = "nextai-config-image",
  ConfigShortcut = "nextai-config-shortcut",
}

export const models: SelectInfo[] = [
  { name: "OpenAI", list: ["gpt-3.5-turbo", "gpt-4"] },
  { name: "Google", list: ["gemini-1.5-pro", "gemini-1.5-flash"] },
];

export const imageModels: SelectInfo[] = [
  { name: "OpenAI", list: ["dall-e-3"] },
  { name: "Stability AI", list: ["stable-diffusion"] },
];

export const shortcuts: ShortcutItem[] = [
  { name: "中英互译", value: "translate" },
  { name: "变量命名", value: "variable" },
  { name: "Emoji 搜索", value: "emoji" },
];

export const variableCase = [
  { value: "lowerCamelCase", name: "小驼峰" },
  { value: "UpperCamelCase", name: "大驼峰" },
  { value: "snake_case", name: "下划线" },
  { value: "kebab-case", name: "短横线" },
];

export const GITHUB_URL = "https://github.com/sunls24/nextai";

export const TOPIC_MAX_LENGTH = 12;
export const AUTO_TOPIC_LENGTH = 4;
export const DEFAULT_TOPIC = "新的聊天";
export const PROMPT_TOPIC =
  "总结本次聊天内容的主题，限制10个字以内，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”";

export const DOT_FLAG = "[](dot)";
