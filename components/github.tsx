"use client";
import React from "react";
import { VERSION } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

function Github() {
  return (
    <Button
      variant="ghost"
      className="px-2"
      onClick={() => open("https://github.com/sunls24/chat-ai")}
    >
      <GithubIcon size={20} strokeWidth={1.6} />
      <span className="ml-1 text-muted-foreground underline underline-offset-2">
        v{VERSION}
      </span>
    </Button>
  );
}

export default Github;
