"use client";
import React from "react";
import { ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emitter, mittKey } from "@/lib/mitt";
import { toast } from "sonner";
import { useChatStore } from "@/lib/store/chat";

function ChatNew() {
  const newSession = useChatStore((state) => state.newSession);

  function onCreate() {
    emitter.emit(mittKey.STOP_LOADING);
    toast.success("已创建新的聊天");
    setTimeout(newSession);
  }

  return (
    <Button variant="ghost" size="icon" onClick={onCreate}>
      <ListPlus strokeWidth={1.4} />
    </Button>
  );
}

export default ChatNew;
