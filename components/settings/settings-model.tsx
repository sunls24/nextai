import React from "react";
import { useConfig } from "@/lib/store/config-chat";
import SelectWarp from "@/components/select-warp";
import { models } from "@/lib/constants";

function SettingsModel({ className }: { className?: string }) {
  const model = useConfig((state) => state.apiConfig.model);
  const updateConfig = useConfig((state) => state.update);

  return (
    <SelectWarp
      label="Model"
      infoList={models}
      select={model}
      onValueChange={(v) => updateConfig((c) => (c.apiConfig.model = v))}
      className={className}
      widthClass="w-[180px]"
    />
  );
}

export default SettingsModel;
