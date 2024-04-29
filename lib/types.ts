import React from "react";
import { Message } from "ai";

export interface SelectInfo {
  name: string;
  list: string[];
}

export interface ShortcutItem {
  name: string;
  value: string;
  component: (props: {
    isLoading: boolean;
    onSend: (msg: string, systemPrompt: Message[]) => void;
    getResponse: (presetCount: number) => string | undefined;
  }) => React.JSX.Element;
}

export interface EmojiItem {
  value: string;
  name: string;
}
