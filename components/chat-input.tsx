import React, { ChangeEventHandler, useState } from "react";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import {
  Languages,
  ListRestart,
  PauseCircle,
  RefreshCcw,
  SendHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store/chat";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useConfig } from "@/lib/store/config-chat";
import { clsx } from "clsx";
import { MODE_TRANSLATE } from "@/lib/constants";

function ChatInput({
  isLoading,
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  stop,
}: {
  input: string;
  isLoading: boolean;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: ChangeEventHandler<HTMLFormElement>;
  stop: () => void;
}) {
  const resetSession = useChatStore((state) => state.resetSession);
  const [mode, update] = useConfig((state) => [state.mode, state.update]);

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

  function onTranslateMode() {
    update((cfg) => (cfg.mode = mode ? "" : MODE_TRANSLATE));
  }

  return (
    <form onSubmit={handleSubmit} className="relative p-3 pt-1.5">
      <div className="mb-1.5 flex items-center gap-1">
        <Button
          type="button"
          className={clsx(
            "h-8 gap-1 px-2",
            mode == MODE_TRANSLATE &&
              "bg-muted-foreground/20 hover:bg-muted-foreground/20",
          )}
          size="sm"
          variant="ghost"
          onClick={onTranslateMode}
        >
          <Languages strokeWidth={1.5} size={22} />
          翻译模式
        </Button>
        <Separator orientation="vertical" className="h-6" />
        {!isLoading && (
          <Button
            type="button"
            className="h-8 gap-1 px-2"
            size="sm"
            variant="ghost"
            onClick={() => {
              resetSession();
              toast.success("聊天已重置");
            }}
          >
            <ListRestart strokeWidth={1.5} size={22} />
            重置聊天
          </Button>
        )}
        {isLoading && (
          <Button
            type="button"
            className="h-8 gap-1 px-2"
            size="sm"
            variant="ghost"
            onClick={stop}
          >
            <PauseCircle strokeWidth={1.5} size={22} /> 停止输出
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
