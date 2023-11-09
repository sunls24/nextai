export const StoreVersion = 2.1;
export const VERSION = "2.1.0";

export const OPENAI_API_KEY = "OPENAI_API_KEY";

export enum Store {
  Chat = "chat-next-store",
  Config = "chat-next-config",
}

export const models = ["gpt-3.5-turbo", "gpt-3.5-turbo-1106"];

export const TOPIC_MAX_LENGTH = 12;
export const AUTO_TOPIC_LENGTH = 4;
export const DEFAULT_TOPIC = "新的聊天";
export const PROMPT_TOPIC =
  "总结本次聊天内容的主题，限制10个字以内，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”";
