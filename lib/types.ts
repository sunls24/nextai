import React from "react";
import { Message } from "ai";

export interface SelectInfo {
  name: string;
  list: string[];
}

export type ShortcutComponent = (props: {
  isLoading: boolean;
  response: string | undefined;
  onSend: (msg: string, systemPrompt: Message[]) => void;
}) => React.JSX.Element;

export interface ShortcutItem {
  name: string;
  value: string;
  component?: ShortcutComponent;
}

export interface EmojiItem {
  value: string;
  name: string;
}
