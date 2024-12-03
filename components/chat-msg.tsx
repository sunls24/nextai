import React, { useMemo } from "react";
import clsx from "clsx";
import { Message } from "ai";
import Markdown from "@/components/markdown";
import { ChatGPT } from "@/components/svg";
import { copyToClipboard, fmtLocaleTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Loader, Pencil, RefreshCw, Trash } from "lucide-react";
import CommonEdit from "@/components/dialog/common-edit";
import { DOT_FLAG } from "@/lib/constants";
import { toast } from "sonner";

function ChatMsg({
  index,
  dot,
  msg,
  reload,
  deleteMsg,
  editMsg,
}: {
  index: number;
  dot: boolean;
  msg: Message;
  reload: (() => void) | undefined;
  deleteMsg: ((index: number) => void) | undefined;
  editMsg: ((index: number, content: string) => void) | undefined;
}) {
  const right = useMemo(() => msg.role === "user", [msg.role]);

  function copyClick() {
    copyToClipboard(msg.content);
  }

  function deleteClick() {
    deleteMsg?.(index);
  }

  return (
    <div className={clsx("flex pb-6", right ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "hover-trigger relative flex min-w-[122px] max-w-full flex-col gap-2 sm:max-w-3xl",
          right ? "items-end" : "items-start",
        )}
      >
        <div
          className={clsx(
            "flex w-full items-end gap-2 px-0.5",
            right && "flex-row-reverse",
          )}
        >
          <ChatAvatar right={right} />
          {!right && <span className="flex-1" />}
          {reload && !msg.toolInvocations && (
            <Button
              variant="outline"
              size="icon"
              onClick={reload}
              className="hover-show h-8 w-8"
            >
              <RefreshCw size={16} />
            </Button>
          )}
          {editMsg && !msg.toolInvocations && (
            <CommonEdit
              title="编辑消息"
              content={msg.content}
              updateContent={(content) => {
                editMsg(index, content);
                toast.success("消息内容编辑成功");
              }}
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="hover-show h-8 w-8"
                >
                  <Pencil size={16} />
                </Button>
              }
            />
          )}
          {deleteMsg && (
            <Button
              variant="outline"
              size="icon"
              onClick={deleteClick}
              className="hover-show h-8 w-8"
            >
              <Trash size={16} />
            </Button>
          )}
          {!msg.toolInvocations && (
            <Button
              variant="outline"
              size="icon"
              onClick={copyClick}
              className="hover-show h-8 w-8"
            >
              <Copy size={16} />
            </Button>
          )}
        </div>
        {msg.content && (
          <div className="max-w-full rounded-md border bg-secondary p-2">
            <Markdown content={msg.content + (dot ? DOT_FLAG : "")} />
          </div>
        )}
        {msg.toolInvocations &&
          msg.toolInvocations.map((tool) => (
            <div key={tool.toolCallId} className="max-w-full rounded-md border">
              <div className="flex items-center p-2">
                <span className="font-medium">谷歌搜索：</span>
                {tool.args.keyword}
                {tool.state !== "result" && (
                  <Loader
                    size={20}
                    className="ml-1 inline animate-spin"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              {tool.state === "result" && (
                <div className="space-y-2 border-t p-2">
                  {tool.result.map((v: any, i: number) => (
                    <a
                      key={i}
                      className="block cursor-pointer underline decoration-transparent underline-offset-4 transition-colors hover:text-blue-400 hover:decoration-blue-400"
                      href={v.link}
                      target="_blank"
                    >
                      {v.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        <CreatedAt time={msg.createdAt} />
      </div>
    </div>
  );
}

export default React.memo(ChatMsg);

const ChatAvatar = React.memo(function ChatAvatar({
  right,
}: {
  right: boolean;
}) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-dashed bg-secondary text-lg">
      {right ? "🥳" : <ChatGPT />}
    </div>
  );
});

const CreatedAt = React.memo(function CreatedAt({
  time,
}: {
  time: Date | undefined;
}) {
  if (!time) {
    return;
  }
  return (
    <span className="absolute -bottom-4 w-[122px] self-end text-right text-xs text-muted-foreground opacity-60">
      {fmtLocaleTime(time)}
    </span>
  );
});
