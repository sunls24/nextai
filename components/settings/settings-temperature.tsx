"use client";
import React from "react";
import { useConfig } from "@/lib/store/config-chat";
import { Label } from "@/components/ui/label";
import TooltipWrap from "@/components/tooltip-wrap";
import { Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { clsx } from "clsx";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsTemperature({ className }: { className?: string }) {
  const temperature = useConfig((state) => state.apiConfig.temperature);
  const updateConfig = useConfig((state) => state.update);

  return (
    <div className={clsx("flex h-9 items-center gap-2", className)}>
      <Label className="shrink-0">Temperature</Label>
      <TooltipWrap
        trigger={<Info className="hidden sm:block" size={16} />}
        content="随机性：值越大回复越随机"
      />
      <span className="flex-1" />
      <Mounted fallback={<Skeleton className="h-6 w-[50%]" />}>
        <Label>{temperature.toFixed(1)}</Label>
        <Slider
          max={1}
          step={0.1}
          className="w-[50%]"
          value={[temperature]}
          onValueChange={(v) =>
            updateConfig((c) => (c.apiConfig.temperature = v[0]))
          }
        />
      </Mounted>
    </div>
  );
}

export default SettingsTemperature;
