import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import HeaderSimple from "@/components/header-simple";
import { Layers2 } from "lucide-react";
import Shortcut from "@/components/shortcut/shortcut";

export const metadata: Metadata = {
  title: "快捷应用",
  appleWebApp: {
    title: "快捷应用",
  },
};

export default function Page() {
  return (
    <main className="py-[13px] sm:py-8">
      <Card className="mx-auto w-[95%] max-w-5xl">
        <HeaderSimple
          title="快捷应用"
          icon={<Layers2 size={20} strokeWidth={1.8} />}
        />
        <Separator />
        <Shortcut />
      </Card>
    </main>
  );
}
