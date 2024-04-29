"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChat } from "ai/react";
import { useConfig } from "@/lib/store/config-chat";
import { nanoid } from "ai";
import { toast } from "sonner";
import { shortcuts } from "@/lib/constants";
import { useShortcutConfig } from "@/lib/store/config-shortcut";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function Shortcut() {
  const { append, messages, setMessages, isLoading } = useChat({
    onError(err) {
      toast.error(err.message);
    },
  });

  const apiConfig = useConfig((state) => state.apiConfig);
  const config = useShortcutConfig();

  function getOptions() {
    return {
      options: {
        body: {
          config: {
            ...apiConfig,
            systemPrompt: false,
            temperature: 0.3,
            plugins: {},
          },
        },
      },
    };
  }

  function onSend(msg: string, systemPrompt: string) {
    setMessages([
      {
        role: "system",
        content: systemPrompt,
        id: nanoid(),
      },
    ]);
    append({ role: "user", content: msg }, getOptions());
  }

  function getResponse() {
    if (messages.length === 0) {
      return;
    }
    const last = messages[messages.length - 1];
    if (last && last.role === "assistant") {
      return last.content;
    }
  }

  return (
    <Tabs
      value={config.current}
      className="p-3"
      onValueChange={(tv) => {
        setMessages([]);
        config.update((cfg) => (cfg.current = tv));
      }}
    >
      <Mounted fallback={<Skeleton className="h-9" />}>
        <TabsList>
          {shortcuts.map((v, i) => (
            <TabsTrigger key={i} value={v.value}>
              {v.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {shortcuts.map((v, i) => (
          <TabsContent key={i} value={v.value} className="mt-3">
            <v.component
              onSend={onSend}
              response={getResponse()}
              isLoading={isLoading}
            />
          </TabsContent>
        ))}
      </Mounted>
    </Tabs>
  );
}

export default Shortcut;
