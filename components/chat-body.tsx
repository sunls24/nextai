import React, { useEffect, useRef, useState } from "react";
import ChatMsg from "@/components/chat-msg";
import { Message } from "ai";
import { emitter, mittKey } from "@/lib/mitt";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";

function ChatBody({
  isLoading,
  messages,
  reload,
  deleteMsg,
  editMsg,
}: {
  isLoading: boolean;
  messages: Message[];
  reload: () => void;
  deleteMsg: (index: number) => void;
  editMsg: (index: number, content: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(false);

  useEffect(() => {
    (scrollRef.current!.firstElementChild as HTMLDivElement).style.display =
      "block";

    emitter.on(mittKey.SCROLL, scrollTo);
    return () => emitter.off(mittKey.SCROLL, scrollTo);
  }, []);

  useEffect(() => {
    setAutoScroll(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!autoScroll) {
      return;
    }
    scrollTo();
  });

  function scrollTo() {
    requestAnimationFrame(() => {
      if (
        !scrollRef.current ||
        scrollRef.current.scrollHeight ===
          scrollRef.current.clientHeight + scrollRef.current.scrollTop
      ) {
        return;
      }
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    });
  }

  function onScroll(e: HTMLDivElement) {
    if (!isLoading) {
      return;
    }
    const hitBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 30;
    if (hitBottom === autoScroll) {
      return;
    }
    setAutoScroll(hitBottom);
  }

  return (
    <ScrollArea
      ref={scrollRef}
      className="flex-1"
      viewportClass="p-2 sm:p-4"
      onScroll={(e) => onScroll(e.currentTarget)}
    >
      {messages.map((value, index) => {
        return (
          <div key={value.id}>
            <ChatMsg
              index={index}
              msg={value}
              deleteMsg={!isLoading ? deleteMsg : undefined}
              editMsg={!isLoading ? editMsg : undefined}
              reload={
                !isLoading &&
                index === messages.length - 1 &&
                (index != 0 || value.role === "user")
                  ? reload
                  : undefined
              }
              dot={
                isLoading &&
                index === messages.length - 1 &&
                value.role === "assistant"
              }
            />
          </div>
        );
      })}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <Loader className="animate-spin" strokeWidth={1.5} />
      )}
    </ScrollArea>
  );
}

export default ChatBody;
