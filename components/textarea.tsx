import React, { ChangeEventHandler, KeyboardEventHandler } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  placeholder,
  value,
  onChange,
  onKeyDown,
  autoFocus,
  disabled,
  minRows = 3,
  maxRows = 20,
  rows = minRows,
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  autoFocus?: boolean;
  disabled?: boolean;

  rows?: number;
  minRows?: number;
  maxRows?: number;
}) {
  if (rows !== minRows) {
    rows = Math.min(Math.max(rows, minRows), maxRows);
  }
  return (
    <TextareaAutosize
      cacheMeasurements={true}
      rows={rows}
      minRows={minRows}
      maxRows={maxRows}
      className={cn("input block w-full resize-none", className)}
      placeholder={placeholder}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
}

export default React.memo(Textarea);
