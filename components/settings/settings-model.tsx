"use client";
import React, { useMemo } from "react";
import { useConfig } from "@/lib/store/config-chat";
import SelectWarp from "@/components/select-warp";
import { models } from "@/lib/constants";

function SettingsModel({ className }: { className?: string }) {
  const model = useConfig((state) => state.apiConfig.model);
  const [customModels, updateConfig] = useConfig((state) => [
    state.customModels,
    state.update,
  ]);

  const mergedModels = useMemo(() => {
    if (!customModels) {
      return models;
    }

    const modelsSet = new Set(models.flatMap((v) => v.list));
    const list = customModels
      .split(",")
      .filter((str) => !!str && !modelsSet.has(str));
    if (list.length === 0) {
      return models;
    }
    return [...models, { name: "Custom", list: Array.from(new Set(list)) }];
  }, [customModels]);

  return (
    <SelectWarp
      label="Model"
      infoList={mergedModels}
      select={model}
      onValueChange={(v) => updateConfig((c) => (c.apiConfig.model = v))}
      className={className}
      widthClass="w-[180px]"
    />
  );
}

export default SettingsModel;
