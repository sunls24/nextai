import React from "react";
import { GithubButton, HomeButton } from "@/components/button-icon";
import { Separator } from "@/components/ui/separator";

function HeaderSimple({ title }: { title: string }) {
  return (
    <header className="flex h-12 items-center gap-2 px-4">
      <h2 className="text-base font-medium">{title}</h2>
      <span className="flex-1" />
      <HomeButton />
      <Separator orientation="vertical" />
      <GithubButton />
    </header>
  );
}

export default HeaderSimple;
