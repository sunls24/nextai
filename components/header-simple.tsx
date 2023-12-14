import React, { ReactElement } from "react";
import { GithubButton, HomeButton } from "@/components/button-icon";
import { Separator } from "@/components/ui/separator";

function HeaderSimple({ title, icon }: { title: string; icon?: ReactElement }) {
  return (
    <header className="flex h-12 items-center gap-1 px-4">
      {icon}
      <h2 className="text-base font-medium">{title}</h2>
      <span className="flex-1" />
      <HomeButton />
      <Separator orientation="vertical" className="mx-1" />
      <GithubButton />
    </header>
  );
}

export default HeaderSimple;
