import React, { useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Search } from "lucide-react";
import { Message, nanoid } from "ai";
import { EmojiItem } from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";

const systemMessage: Message[] = [
  {
    id: nanoid(),
    role: "system",
    content:
      "Please recommend emojis related to user messages, quantity is limited between 10 and 20, and sort by relevance. no need to explain anything and only reply using structured data.",
  },
  {
    id: nanoid(),
    role: "user",
    content: "微笑",
  },
  {
    id: nanoid(),
    role: "assistant",
    content:
      "😀:笑脸|😁:眯眼笑｜😆:眯眼大笑|🙂:微微笑|😅:面带冷汗的笑脸|😇:带光环微笑的脸|🥰:带心形眼睛的微笑脸|😙:带笑眼打招呼|🥲:带笑脸与泪水|🤗:张开双手微笑的脸|🤭:捂嘴笑|😎:墨镜笑脸|😈:带角笑脸|😸:眯眯笑的猫|👄:嘴巴|🌞:面带笑容的太阳",
  },
];

function Emoji({
  getResponse,
  isLoading,
  onSend,
}: {
  isLoading: boolean;
  onSend: (msg: string, systemMessage: Message[]) => void;
  getResponse: () => string | undefined;
}) {
  const response = getResponse();
  const inputRef = useRef<HTMLInputElement>(null);

  function onSearch() {
    const input = inputRef.current!.value.trim();
    if (!input) {
      return;
    }
    onSend(input, systemMessage);
  }

  const emojis = useMemo(() => {
    if (!response) {
      return [];
    }
    return response.split("|").map<EmojiItem>((e, i) => {
      const sp = e.split(":");
      return { value: sp[0], name: sp[1] ?? "..." };
    });
  }, [response]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    if (isLoading) {
      return;
    }
    onSearch();
  }

  return (
    <>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          className="max-w-sm"
          placeholder="请输入关键字进行搜索 🧐"
          onKeyDown={onKeyDown}
        />
        <Button
          size="icon"
          className="shrink-0"
          disabled={isLoading}
          onClick={onSearch}
        >
          {isLoading ? (
            <RefreshCcw size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </Button>
      </div>
      <div className="mt-3 flex w-fit flex-wrap justify-between gap-2">
        {emojis.map((v, i) => (
          <div
            key={i}
            className="flex h-fit w-20 cursor-pointer flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-secondary"
            onClick={() => copyToClipboard(v.value)}
          >
            <span className="text-3xl">{v.value}</span>
            <span className="text-sm text-muted-foreground">{v.name}</span>
          </div>
        ))}
        <div className="flex-1" />
      </div>
      {!!emojis.length && (
        <div className="mx-auto mt-2 w-fit text-xs italic text-muted-foreground">
          点击表情进行复制
        </div>
      )}
    </>
  );
}

export default Emoji;
