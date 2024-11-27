"use client";
import React, { ReactElement } from "react";
import { GITHUB_URL, VERSION } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { clsx } from "clsx";

function ButtonIcon({
  url,
  text,
  icon,
  textClass,
}: {
  url: string;
  text: string;
  icon: ReactElement;
  textClass?: string;
}) {
  return (
    <Button
      variant="ghost"
      className="group px-2 text-muted-foreground"
      onClick={() => open(url)}
    >
      {icon}
      <span
        className={clsx(
          "ml-1 decoration-[1.3px] underline-offset-4 group-hover:underline",
          textClass,
        )}
      >
        {text}
      </span>
    </Button>
  );
}

export default ButtonIcon;

export function GithubButton() {
  return (
    <ButtonIcon
      url={GITHUB_URL}
      text={`v${VERSION}`}
      icon={<GithubIcon size={20} strokeWidth={1.8} />}
    />
  );
}
