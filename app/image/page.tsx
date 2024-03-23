import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Body from "@/components/image/body";
import HeaderSimple from "@/components/header-simple";
import { Cat } from "lucide-react";

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
        <HeaderSimple
          title="文生图"
          icon={<Cat size={20} strokeWidth={1.8} />}
        />
        <Separator />
        <Body />
      </Card>
    </main>
  );
}
