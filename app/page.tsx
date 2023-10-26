import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Chat from "@/components/chat";

export default function Page() {
  return (
    <main className="h-full pt-[13px]">
      <Card className="mx-auto flex h-full w-[95%] max-w-5xl flex-col">
        <Header />
        <Separator />
        <Chat />
      </Card>
    </main>
  );
}
