import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useConfig } from "@/lib/store/config-chat";
import { clsx } from "clsx";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsGoogle({ className }: { className?: string }) {
  const updateConfig = useConfig((state) => state.update);
  const searchEnable = useConfig(
    (state) => state.apiConfig.plugins.googleSearch,
  );

  function onGSToggle(enabled: boolean) {
    updateConfig((c) => (c.apiConfig.plugins.googleSearch = enabled));
  }

  return (
    <div className={clsx("flex h-9 items-center justify-between", className)}>
      <Label className="shrink-0">Google 搜索</Label>
      <Mounted fallback={<Skeleton className="h-6 w-9" />}>
        <Switch checked={searchEnable} onCheckedChange={onGSToggle} />
      </Mounted>
    </div>
  );
}

export default SettingsGoogle;
