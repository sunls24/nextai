"use client";
import React, { FormEvent, useState } from "react";
import Textarea from "@/components/textarea";
import { SendButton } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { Message, nanoid } from "ai";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { variableCase } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { useShortcutConfig } from "@/lib/store/config-shortcut";

function Variable({
  response,
  isLoading,
  onSend,
}: {
  isLoading: boolean;
  response: string | undefined;
  onSend: (msg: string, systemMessage: Message[]) => void;
}) {
  const [input, setInput] = useState("");
  const [config, updateCfg] = useShortcutConfig((cfg) => [
    cfg.variable,
    cfg.update,
  ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input) {
      return;
    }
    onSend(input, [
      {
        role: "system",
        content: `Translate the variable name into English and reply according to the ${config.case} rule. Only reply with the variable name, no other content.`,
        id: nanoid(),
      },
    ]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    if (isLoading) {
      return;
    }
    onSubmit(e);
  }

  return (
    <>
      <RadioGroup
        disabled={isLoading}
        defaultValue={config.case}
        onValueChange={(v) => updateCfg((cfg) => (cfg.variable.case = v))}
        className="flex items-center space-x-2 py-1"
      >
        {variableCase.map((v, i) => (
          <div key={i} className="flex items-center space-x-1">
            <RadioGroupItem value={v.value} id={v.value} />
            <Label htmlFor={v.value}>{v.name}</Label>
          </div>
        ))}
      </RadioGroup>

      <form className="relative mt-3" onSubmit={onSubmit}>
        <Textarea
          maxRows={10}
          placeholder="请输入中文变量名称"
          disabled={isLoading}
          className="!pr-12"
          autoFocus={true}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <SendButton isLoading={isLoading} className="bottom-2 right-2" />
      </form>

      {response && (
        <div className="mt-3 w-fit max-w-full">
          <div className="overflow-x-auto whitespace-break-spaces rounded-md border bg-secondary p-2">
            {response}
          </div>
          {!isLoading && (
            <div className="mt-3 flex flex-row-reverse">
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(response)}
              >
                <Copy size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Variable;
