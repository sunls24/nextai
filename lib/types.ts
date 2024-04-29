import React from "react";

export interface SelectInfo {
  name: string;
  list: string[];
}

export interface ShortcutItem {
  name: string;
  value: string;
  component: (props: {
    response?: string;
    isLoading: boolean;
    onSend: (msg: string, systemPrompt: string) => void;
  }) => React.JSX.Element;
}
