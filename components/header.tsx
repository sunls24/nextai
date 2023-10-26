import React from "react";
import { GalleryVertical, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderTopic from "@/components/header-topic";
import { ModeToggle } from "@/components/mode-toggle";
import ChatList from "@/components/dialog/chat-list";
import Settings from "@/components/dialog/settings";

function Header() {
  return (
    <header className="flex h-12 items-center gap-1 px-4">
      <HeaderTopic />
      <ChatList
        trigger={
          <Button variant="ghost" size="icon">
            <GalleryVertical strokeWidth={1.5} size={20} />
          </Button>
        }
      />
      <span className="flex-1" />
      <ModeToggle />
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
