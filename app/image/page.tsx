import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Github from "@/components/github";
import Body from "@/components/image/body";

export const metadata: Metadata = {
  title: "文生图",
  appleWebApp: {
    title: "文生图",
  },
};

export default function Page() {
  return (
    <main className="pt-[13px] sm:pt-8">
      <Card className="mx-auto w-[95%] max-w-5xl">
        <header className="flex h-12 items-center gap-1 px-4">
          <h2 className="text-base font-medium">文生图</h2>
          <span className="flex-1" />
          <Github />
        </header>
        <Separator />
        <Body />
      </Card>
    </main>
  );
}
