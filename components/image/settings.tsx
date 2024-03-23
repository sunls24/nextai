import React, { useState } from "react";
import { useImageConfig } from "@/lib/store/config-image";
import SelectWarp from "@/components/select-warp";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/textarea";
import { Box, RefreshCcw } from "lucide-react";
import { imageModels } from "@/lib/constants";
import Mounted from "@/components/mounted";
import SettingsSwitch from "@/components/settings/settings-switch";
import { Skeleton } from "@/components/ui/skeleton";

function Settings({
  isLoading,
  onGenerate,
}: {
  isLoading: boolean;
  onGenerate: (text: string) => Promise<void>;
}) {
  const config = useImageConfig();
  const updateConfig = useImageConfig((state) => state.update);

  const [text, setText] = useState<string>();

  async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    e.preventDefault();
    await onClick();
  }

  async function onClick() {
    if (isLoading || !text) {
      return;
    }
    await onGenerate(text);
  }

  return (
    <div className="flex w-full flex-col gap-4 px-6 py-4 sm:justify-center sm:gap-5 sm:p-14">
      <SelectWarp
        label="模型"
        select={config.model}
        infoList={imageModels}
        onValueChange={(v) => updateConfig((cfg) => (cfg.model = v))}
        widthClass="w-[150px]"
        disabled={isLoading}
        icon={<Box size={20} strokeWidth={1.8} />}
      />
      <Textarea
        placeholder="生成图像的文字描述，例如：一只可爱的小猫 🐱"
        value={text}
        autoFocus={true}
        disabled={isLoading}
        onChange={(e) => setText(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        rows={3}
        minRows={3}
        maxRows={3}
      />
      <div className="flex items-center justify-between">
        <Mounted fallback={<Skeleton className="h-8 w-32" />}>
          {config.model === "dall-e-3" && (
            <span className="text-muted-foreground">图片将在一小时后过期</span>
          )}
          {config.model === "stable-diffusion" && (
            <SettingsSwitch
              label="自动优化提示"
              disabled={isLoading}
              checked={config.autoPrompt ?? true}
              onChange={(v) => updateConfig((cfg) => (cfg.autoPrompt = v))}
            />
          )}
        </Mounted>
        <Button className="w-32" onClick={onClick} disabled={isLoading}>
          {isLoading && (
            <RefreshCcw
              size={20}
              strokeWidth={1.8}
              className="mr-2 animate-spin"
            />
          )}
          生成
        </Button>
      </div>
    </div>
  );
}

export default Settings;
