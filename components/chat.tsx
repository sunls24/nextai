"use client";
import React, { useCallback, useEffect } from "react";
import ChatBody from "@/components/chat-body";
import ChatInput from "@/components/chat-input";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { useChatID, useChatStore } from "@/lib/store/chat";
import { PROMPT_TOPIC } from "@/lib/constants";
import { trimTopic } from "@/lib/utils";
import { useConfig } from "@/lib/store/config-chat";
import { emitter, mittKey } from "@/lib/mitt";
import { Separator } from "@/components/ui/separator";

function Chat() {
  const [savedMessage, saveMessage, editMessage] = useChatStore((state) => [
    state.currentSession().messages,
    state.saveMessage,
    state.editMessage,
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
    id: useChatID(),
    onError(err) {
      toast.error(err.message);
      input && setInput(input);
    },
  });

  const { append: topicAppend, setMessages: topicSetMessages } = useChat({
    onFinish(msg) {
      checkAutoTopic(() => updateCurrentTopic(trimTopic(msg.content)));
    },
  });

  const apiConfig = useConfig((state) => state.apiConfig);
  const autoTitle = useConfig((state) => state.autoGenerateTitle);

  useEffect(() => {
    emitter.on(mittKey.STOP_LOADING, stop);
    return () => emitter.off(mittKey.STOP_LOADING, stop);
  }, []);

  const [contextIndex, updateContext] = useChatStore((state) => [
    state.currentSession().contextIndex,
    state.updateContext,
  ]);

  const getOptions = useCallback(
    () => ({
      options: {
        body: {
          contextIndex,
          config: {
            ...apiConfig,
            plugins: Object.fromEntries(
              Object.entries(apiConfig.plugins).filter(
                ([, value]) => value.enabled,
              ),
            ),
          },
        },
      },
    }),
    [apiConfig, contextIndex],
  );

  // load message
  useEffect(() => {
    if (messages === savedMessage) {
      return;
    }
    setMessages(savedMessage);
  }, [savedMessage]);

  // save message
  useEffect(() => {
    if (isLoading || messages.length === 0 || messages === savedMessage) {
      return;
    }
    saveMessage(messages);
    if (autoTitle) {
      checkAutoTopic(() => {
        topicSetMessages(messages);
        topicAppend({ role: "user", content: PROMPT_TOPIC }, getOptions());
      });
    }
  }, [isLoading]);

  const deleteMsg = useCallback(
    (index: number) => {
      messages.splice(index, 1);
      saveMessage(messages);
      toast.success("消息已删除");
      if (index < contextIndex) {
        updateContext(contextIndex - 1);
      }
    },
    [messages, contextIndex],
  );

  const reloadByConfig = useCallback(() => reload(getOptions()), [getOptions]);

  return (
    <div className="flex h-0 flex-1 flex-col">
      <ChatBody
        isLoading={isLoading}
        messages={messages}
        contextIndex={contextIndex}
        reload={reloadByConfig}
        deleteMsg={deleteMsg}
        editMsg={editMessage}
      />
      <Separator />
      <ChatInput
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={(e) => handleSubmit(e, getOptions())}
        stop={stop}
        updateContext={() => {
          if (messages.length === 0) {
            return;
          }
          if (contextIndex && contextIndex === messages.length) {
            updateContext(0);
            return;
          }
          if (isLoading) {
            stop();
            if (messages.length === 1 && messages[0].role === "user") {
              return;
            }
          }
          updateContext(messages.length);
          emitter.emit(mittKey.SCROLL);
        }}
      />
    </div>
  );
}

export default Chat;
