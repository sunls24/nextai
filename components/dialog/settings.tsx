"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { ClipboardCopy, Github, Info, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useConfig } from "@/lib/store/config";
import { VERSION } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import TooltipWrap from "@/components/tooltip-wrap";
import SettingsModel from "@/components/settings-model";
import SettingsTemperature from "@/components/settings-temperature";
import SettingsGoogle from "@/components/settings-google";
import { ModeToggle } from "@/components/mode-toggle";
import Login from "@/components/dialog/login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { copyToClipboard, fmtLocaleTime } from "@/lib/utils";

function Settings({ trigger }: { trigger: React.ReactNode }) {
  const updateConfig = useConfig((state) => state.Update);
  const [apiKey, setApiKey] = useState(
    useConfig((state) => state.apiConfig.apiKey),
  );
  const [autoTitle, setAutoTitle] = useState(
    useConfig((state) => state.autoGenerateTitle),
  );

  function onApiKeyChange(value: string) {
    setApiKey(value);
    updateConfig((c) => (c.apiConfig.apiKey = value));
  }

  function onAutoTitleToggle(enabled: boolean) {
    setAutoTitle(enabled);
    updateConfig((c) => (c.autoGenerateTitle = enabled));
  }

  const searchEnabled = useConfig(
    (state) => state.apiConfig.plugins.googleSearch.enabled,
  );
  const [searchApiKey, setSearchApiKey] = useState(
    useConfig((state) => state.apiConfig.plugins.googleSearch.apiKey),
  );
  const [searchEngineId, setSearchEngineId] = useState(
    useConfig((state) => state.apiConfig.plugins.googleSearch.engineId),
  );

  function onGSApiKeyChange(value: string) {
    setSearchApiKey(value);
    updateConfig((c) => (c.apiConfig.plugins.googleSearch.apiKey = value));
  }

  function onGSEngineIdChange(value: string) {
    setSearchEngineId(value);
    updateConfig((c) => (c.apiConfig.plugins.googleSearch.engineId = value));
  }

  const [browseWebsite, setBrowseWebsite] = useState(
    useConfig((state) => state.apiConfig.plugins.browseWebsite),
  );

  function onBWToggle(enabled: boolean) {
    setBrowseWebsite({ ...browseWebsite, enabled });
    updateConfig((c) => (c.apiConfig.plugins.browseWebsite.enabled = enabled));
  }

  function onBWMaxLengthChange(maxLength: number) {
    setBrowseWebsite({ ...browseWebsite, maxLength });
    updateConfig(
      (c) => (c.apiConfig.plugins.browseWebsite.maxLength = maxLength),
    );
  }

  const [weatherInfo, setWeatherInfo] = useState(
    useConfig((state) => state.apiConfig.plugins.weatherInfo),
  );

  function onWIToggle(enabled: boolean) {
    setWeatherInfo({ ...weatherInfo, enabled });
    updateConfig((c) => (c.apiConfig.plugins.weatherInfo.enabled = enabled));
  }

  function onWIAmapKeyChange(amapKey: string) {
    setWeatherInfo({ ...weatherInfo, amapKey });
    updateConfig((c) => (c.apiConfig.plugins.weatherInfo.amapKey = amapKey));
  }

  const [imageGeneration, setImageGeneration] = useState(
    useConfig((state) => state.apiConfig.plugins.imageGeneration),
  );

  function onIGToggle(enabled: boolean) {
    setImageGeneration({ ...imageGeneration, enabled });
    updateConfig(
      (c) => (c.apiConfig.plugins.imageGeneration.enabled = enabled),
    );
  }

  const loginCfg = useConfig((state) => state.login);

  function onTokenCopy() {
    copyToClipboard(loginCfg.data.accessToken);
  }

  function onLogout() {
    updateConfig((cfg) => {
      cfg.login = {
        enable: false,
        data: cfg.login.data,
      };
      cfg.apiConfig.apiKey = "";
    });
    setApiKey("");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>
        <ScrollArea>
          <Card className="mb-4 flex flex-col gap-4 p-4">
            {loginCfg.enable ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">OpenAI 账号已登录</h3>
                  <Button variant="ghost" onClick={onLogout}>
                    注销
                    <LogOut size={18} className="ml-1" />
                  </Button>
                </div>
                <Separator />
                <div className="flex items-end">
                  <Avatar className="mr-4 h-16 w-16">
                    <AvatarImage src={loginCfg.data.user.image} />
                    <AvatarFallback>OpenAI</AvatarFallback>
                  </Avatar>
                  <Mail strokeWidth={1.8} size={22} className="mb-1" />
                  <span className="mb-1 ml-1 text-base font-medium">
                    {loginCfg.data.user.email}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex h-9 items-center">
                    <Label>AccessToken:</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={onTokenCopy}
                    >
                      <ClipboardCopy size={20} />
                    </Button>
                    <span className="text-muted-foreground">点击复制</span>
                  </div>
                  <div className="flex h-9 items-center">
                    <Label>过期时间：</Label>
                    <span className="ml-2 text-muted-foreground">
                      {fmtLocaleTime(new Date(loginCfg.data.expires))}
                    </span>
                  </div>
                </div>
                <Login
                  email={loginCfg.data.user.email}
                  trigger={<Button>重新登录</Button>}
                />
              </>
            ) : (
              <>
                <Login
                  email={loginCfg.data?.user.email}
                  trigger={
                    <Button variant="secondary">使用 OpenAI 账号登录</Button>
                  }
                />
                <div className="flex items-center justify-between">
                  <Label>API Key</Label>
                  <Input
                    placeholder="自定义 OpenAI Api Key"
                    className="w-[70%]"
                    value={apiKey}
                    onChange={(e) =>
                      onApiKeyChange(e.currentTarget.value.trim())
                    }
                  />
                </div>
                <SettingsModel />
                <SettingsTemperature />
                <Separator />
                <div className="flex h-9 items-center justify-between">
                  <Label>自动生成标题</Label>
                  <Switch
                    checked={autoTitle}
                    onCheckedChange={onAutoTitleToggle}
                  />
                </div>
              </>
            )}
          </Card>
          {!loginCfg.enable && (
            <Card className="flex flex-col gap-4 p-4">
              <Label>插件设置</Label>
              <Separator />
              <SettingsGoogle />
              {searchEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <Label>API Key</Label>
                    <Input
                      placeholder="自定义 Search Api Key"
                      className="w-[70%]"
                      value={searchApiKey}
                      onChange={(e) =>
                        onGSApiKeyChange(e.currentTarget.value.trim())
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Engine ID</Label>
                    <Input
                      placeholder="自定义 Search Engine ID"
                      className="w-[70%]"
                      value={searchEngineId}
                      onChange={(e) =>
                        onGSEngineIdChange(e.currentTarget.value.trim())
                      }
                    />
                  </div>
                </>
              )}
              <Separator />
              <div className="flex h-9 items-center justify-between">
                <Label>图像生成</Label>
                <Switch
                  checked={imageGeneration.enabled}
                  onCheckedChange={onIGToggle}
                />
              </div>
              <Separator />
              <div className="flex h-9 items-center justify-between">
                <Label>浏览网页</Label>
                <Switch
                  checked={browseWebsite.enabled}
                  onCheckedChange={onBWToggle}
                />
              </div>
              {browseWebsite.enabled && (
                <>
                  <div className="flex items-center gap-2">
                    <Label>最大长度</Label>
                    <TooltipWrap
                      trigger={<Info size={16} />}
                      content="避免触发 Token 限制"
                    />
                    <span className="flex-1" />
                    <Input
                      type="number"
                      className="w-[25%]"
                      value={browseWebsite.maxLength}
                      onChange={(e) =>
                        onBWMaxLengthChange(e.currentTarget.valueAsNumber)
                      }
                    />
                  </div>
                </>
              )}
              <Separator />
              <div className="flex h-9 items-center justify-between">
                <Label>查询天气</Label>
                <Switch
                  checked={weatherInfo.enabled}
                  onCheckedChange={onWIToggle}
                />
              </div>
              {weatherInfo.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <Label>高德 Key</Label>
                    <Input
                      placeholder="自定义高德 Key"
                      className="w-[70%]"
                      value={weatherInfo.amapKey}
                      onChange={(e) =>
                        onWIAmapKeyChange(e.currentTarget.value.trim())
                      }
                    />
                  </div>
                </>
              )}
            </Card>
          )}
        </ScrollArea>
        <div className="flex justify-between">
          <ModeToggle />
          <Button
            variant="ghost"
            className="px-2"
            onClick={() => open("https://github.com/sunls24/chat-ai")}
          >
            <Github size={20} strokeWidth={1.5} />
            <span className="ml-1 text-muted-foreground underline underline-offset-2">
              v{VERSION}
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Settings;
