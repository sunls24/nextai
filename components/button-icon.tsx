"use client";
import React, { ReactElement } from "react";
import { GITHUB_URL, VERSION } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowUpRightFromCircle, GithubIcon, Image } from "lucide-react";

function ButtonIcon({
  url,
  text,
  icon,
}: {
  url: string;
  text: string;
  icon: ReactElement;
}) {
  return (
    <Button
      variant="ghost"
      className="group px-2 text-muted-foreground"
      onClick={() => open(url)}
    >
      {icon}
      <span className="ml-1 underline-offset-2 group-hover:underline">
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

export function HomeButton() {
  return (
    <ButtonIcon
      url="/"
      text="去聊天"
      icon={<ArrowUpRightFromCircle size={18} />}
    />
  );
}

export function ImageButton() {
  return (
    <ButtonIcon
      url="/image"
      text="文生图"
      icon={<Image size={20} strokeWidth={1.8} />}
    />
  );
}
