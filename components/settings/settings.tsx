"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { GithubButton } from "@/components/button-icon";
import SettingsPlugins from "@/components/settings/settings-plugins";
import { Plugins, useConfig } from "@/lib/store/config-chat";
import SettingsSwitch from "@/components/settings/settings-switch";
import SettingsInput from "@/components/settings/settings-input";
import SettingsModel from "@/components/settings/settings-model";
import SettingsTemperature from "@/components/settings/settings-temperature";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { providerSelect } from "@/lib/constants";

function Settings({ trigger }: { trigger: React.ReactNode }) {
  const config = useConfig();

  function updatePlugins(fn: (p: Plugins) => void) {
    config.update((cfg) => {
      fn(cfg.apiConfig().plugins as Plugins);
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>
        <Tabs
          defaultValue={config.provider}
          className="flex h-0 flex-1 flex-col"
          onValueChange={(v) => config.update((cfg) => (cfg.provider = v))}
        >
          <TabsList className="mb-4 grid grid-cols-2">
            {providerSelect.map((value, index) => (
              <TabsTrigger key={index} value={value.value}>
                {value.show}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea>
            <Card className="mb-4 flex flex-col gap-4 p-4">
              <SettingsInput
                label="API Key"
                placeholder={`自定义 ${
                  providerSelect.find((v) => v.value === config.provider)!.show
                } API Key`}
                value={config.apiConfig().apiKey}
                onChange={(v) =>
                  config.update((cfg) => (cfg.apiConfig().apiKey = v))
                }
              />
              <SettingsModel />
              <SettingsTemperature />
              <Separator />
              <SettingsSwitch
                label={"自动生成标题"}
                checked={config.autoGenerateTitle}
                onChange={(v) =>
                  config.update((cfg) => (cfg.autoGenerateTitle = v))
                }
              />
            </Card>

            <TabsContent value="openai">
              <SettingsPlugins
                plugins={config.apiConfig().plugins as Plugins}
                updatePlugins={updatePlugins}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between">
          <ModeToggle />
          <GithubButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Settings;
