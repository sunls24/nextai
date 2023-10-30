"use client";
import React, { useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useChatID, useChatStore } from "@/lib/store/chat";
import { Edit, Trash } from "lucide-react";
import { clsx } from "clsx";
import { emitter, mittKey } from "@/lib/mitt";
import toast from "react-hot-toast";
import CommonEdit from "@/components/dialog/common-edit";

function ChatList({ trigger }: { trigger: React.ReactNode }) {
  const { isLoading } = useChat({ id: useChatID() });

  const [
    sessions,
    currentIndex,
    selectSession,
    deleteSession,
    updateTopic,
    newSession,
    deleteOtherSession,
  ] = useChatStore((state) => [
    state.sessions,
    state.currentIndex,
    state.selectSession,
    state.deleteSession,
    state.updateTopic,
    state.newSession,
    state.deleteOtherSession,
  ]);

  const currentRef = useRef<HTMLDivElement>(null);

  function onOpenChange(open: boolean) {
    setOpen(open);
    setTimeout(() => {
      if (!open || !currentRef.current) {
        return;
      }
      currentRef.current.scrollIntoView({ block: "center" });
    });
  }

  function onSelect(index: number) {
    setOpen(false);
    if (index === currentIndex) {
      return;
    }
    if (index !== currentIndex && isLoading) {
      emitter.emit(mittKey.STOP_LOADING);
    }
    setTimeout(() => selectSession(index));
  }

  function onDelete(index: number) {
    if (index === currentIndex && isLoading) {
      emitter.emit(mittKey.STOP_LOADING);
    }
    if (sessions.length === 1) {
      setOpen(false);
    }
    toast.success(`${sessions[index].topic} 已删除`);
    deleteSession(index);
  }

  function onCreate() {
    if (isLoading) {
      emitter.emit(mittKey.STOP_LOADING);
    }
    setOpen(false);
    setTimeout(newSession);
  }

  function onDeleteOther() {
    if (sessions.length === 1) {
      return;
    }
    setOpen(false);
    toast.success("已删除其他聊天");
    deleteOtherSession();
  }

  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>聊天列表</SheetTitle>
        </SheetHeader>
        <ScrollArea
          className="my-5 h-[80%] rounded-md border"
          viewportClass="p-3"
        >
          {sessions.map((value, index) => {
            return (
              <Card
                key={value.id}
                ref={index === currentIndex ? currentRef : undefined}
                onClick={() => onSelect(index)}
                className={clsx(
                  "h-18 hover-trigger mb-2 p-4 last:mb-0 hover:bg-secondary transition-colors",
                  index === currentIndex &&
                    "border-transparent shadow-none outline",
                )}
              >
                <div className="flex h-full items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">{value.topic}</h3>
                    <span className="text-muted-foreground">
                      {value.messages.length}条对话
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <CommonEdit
                      title="编辑聊天标题"
                      content={value.topic}
                      rows={1}
                      updateContent={(topic: string) =>
                        updateTopic(index, topic)
                      }
                      trigger={
                        <Button
                          size="sm"
                          className="hover-show"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit size={16} />
                        </Button>
                      }
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="hover-show"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(index);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </ScrollArea>
        <div className="flex justify-end gap-2">
          <Button onClick={onCreate}>新的聊天</Button>
          <Button variant="destructive" onClick={onDeleteOther}>
            <Trash size={18} className="mr-1" />
            清除其他
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ChatList;
