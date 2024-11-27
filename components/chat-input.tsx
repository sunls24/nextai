import React, { ChangeEventHandler, useState } from "react";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import {
  MessageCircleOff,
  PauseCircle,
  RefreshCcw,
  SendHorizontal,
} from "lucide-react";
import TooltipWrap from "@/components/tooltip-wrap";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store/chat";

function ChatInput({
  isLoading,
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  stop,
}: {
  isLoading: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: ChangeEventHandler<HTMLFormElement>;
  stop: () => void;
}) {
  const resetSession = useChatStore((state) => state.resetSession);

  const [lastInput, setLastInput] = useState<string>();

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      !e.nativeEvent.isComposing &&
      e.key === "ArrowUp" &&
      !input &&
      lastInput
    ) {
      e.preventDefault();
      setInput(lastInput);
      return;
    }
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    e.preventDefault();
    if (isLoading) {
      return;
    }
    e.currentTarget.form?.requestSubmit();
    input && setLastInput(input);
  }

  return (
    <form onSubmit={handleSubmit} className="relative p-3 pt-1">
      <div className="mb-1.5">
        {!isLoading && (
          <TooltipWrap
            content="重置聊天"
            triggerAsChild={true}
            trigger={
              <Button
                type="button"
                className="h-8"
                size="icon"
                variant="ghost"
                onClick={resetSession}
              >
                <MessageCircleOff strokeWidth={1.5} size={22} />
              </Button>
            }
          />
        )}
        {isLoading && (
          <Button
            type="button"
            className="h-8"
            size="icon"
            variant="ghost"
            onClick={stop}
          >
            <PauseCircle strokeWidth={1.5} size={22} />
          </Button>
        )}
      </div>
      <Textarea
        placeholder="问点什么吧！"
        className="!pr-12"
        value={input}
        autoFocus={true}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
      />
      <SendButton isLoading={isLoading} />
    </form>
  );
}

export default ChatInput;

export const SendButton = React.memo(function SendButton({
  isLoading,
  className,
}: {
  isLoading: boolean;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      size="sm"
      className={cn("absolute bottom-5 right-5", className)}
    >
      {isLoading ? (
        <RefreshCcw size={20} strokeWidth={1.8} className="animate-spin" />
      ) : (
        <SendHorizontal size={20} strokeWidth={1.8} />
      )}
    </Button>
  );
});
