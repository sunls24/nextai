import React from "react";
import { GalleryVertical, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderTopic from "@/components/header-topic";
import ChatList from "@/components/dialog/chat-list";
import Settings from "@/components/settings/settings";
import { Separator } from "@/components/ui/separator";
import ChatNew from "@/components/chat-new";

function Header() {
  return (
    <header className="flex h-12 items-center gap-1 pl-4 pr-2">
      <HeaderTopic />
      <ChatList
        trigger={
          <Button variant="ghost" size="icon">
            <GalleryVertical strokeWidth={1.6} size={20} />
          </Button>
        }
      />
      <Separator orientation="vertical" className="h-1/2" />
      <ChatNew />
      <span className="flex-1" />
      <Settings
        trigger={
          <Button variant="ghost" size="icon">
            <SettingsIcon strokeWidth={1.5} size={22} />
          </Button>
        }
      />
    </header>
  );
}

export default Header;
