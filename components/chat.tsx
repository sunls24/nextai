"use client";
import React, { useEffect } from "react";
import ChatBody from "@/components/chat-body";
import ChatInput from "@/components/chat-input";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { useChatStore } from "@/lib/store/chat";
import { trimTopic } from "@/lib/utils";
import { useConfig } from "@/lib/store/config-chat";
import { emitter, mittKey } from "@/lib/mitt";
import { Separator } from "@/components/ui/separator";
import { PROMPT_TOPIC } from "@/lib/constants";

function Chat() {
  const [savedMessage, currentIndex, saveMessage] = useChatStore((state) => [
    state.currentSession().messages,
    state.currentIndex,
    state.saveMessage,
  ]);

  const [checkAutoTopic, updateCurrentTopic] = useChatStore((state) => [
    state.checkAutoTopic,
    state.updateCurrentTopic,
  ]);

  const {
    isLoading,
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    reload,
    stop,
  } = useChat({
    experimental_throttle: 80,
    streamProtocol: "text",
    onError(err) {
      toast.error(err.message);
    },
  });

  const { append: topicAppend, setMessages: topicSetMessages } = useChat({
    streamProtocol: "text",
    onFinish(msg) {
      checkAutoTopic(() => updateCurrentTopic(trimTopic(msg.content)));
    },
  });

  const apiConfig = useConfig((state) => state.apiConfig);
  const [autoTitle, mode] = useConfig((state) => [
    state.autoGenerateTitle,
    state.mode,
  ]);

  useEffect(() => {
    emitter.on(mittKey.STOP_LOADING, stop);
    return () => emitter.off(mittKey.STOP_LOADING, stop);
  }, []);

  function getOptions() {
    return {
      body: {
        config: {
          ...apiConfig,
          systemPrompt: mode ? mode : apiConfig.systemPrompt,
        },
      },
    };
  }

  // save message
  useEffect(() => {
    if (isLoading || messages.length === 0 || messages === savedMessage) {
      return;
    }
    saveMessage(messages);
    if (autoTitle) {
      checkAutoTopic(() => {
        topicSetMessages(messages);
        // noinspection JSIgnoredPromiseFromCall
        topicAppend({ role: "user", content: PROMPT_TOPIC }, getOptions());
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || messages === savedMessage) {
      return;
    }
    setMessages(savedMessage);
    emitter.emit(mittKey.SCROLL);
  }, [savedMessage]);

  function deleteMsg(index: number) {
    messages.splice(index, 1);
    saveMessage(messages);
    toast.success("消息已删除");
  }

  function editMsg(index: number, msg: string) {
    messages[index].content = msg;
    saveMessage(messages);
    toast.success("消息内容已编辑");
  }

  return (
    <div className="flex h-0 flex-1 flex-col">
      <ChatBody
        messages={messages}
        isLoading={isLoading}
        reload={() => reload(getOptions())}
        deleteMsg={deleteMsg}
        editMsg={editMsg}
      />
      <Separator />
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={(e) => handleSubmit(e, getOptions())}
        stop={stop}
      />
    </div>
  );
}

export default Chat;
