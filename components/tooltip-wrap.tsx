import React, { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TooltipWrap({
  content,
  triggerAsChild,
  trigger,
}: {
  content: ReactNode;
  triggerAsChild?: boolean;
  trigger: ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild={triggerAsChild}>{trigger}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipWrap;
