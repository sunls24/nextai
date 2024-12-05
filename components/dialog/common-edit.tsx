import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

function CommonEdit({
  title,
  content,
  updateContent,
  rows,
  trigger,
}: {
  title: string;
  content: string;
  updateContent: (content: string) => void;
  rows?: number;
  trigger: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState(content);

  function onConfirmClick() {
    const edited = inputValue.trim();
    if (!edited) {
      return;
    }
    if (edited !== content) {
      updateContent(edited);
    }
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    e.preventDefault();
    onConfirmClick();
  }

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Textarea
          className="my-2"
          value={inputValue}
          onKeyDown={onKeyDown}
          rows={rows}
          minRows={rows}
          maxRows={rows}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
        <div className="flex justify-end">
          <Button onClick={onConfirmClick}>
            <Check />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommonEdit;
